import "server-only";

import { env } from "@/env";
import { zip } from "lodash";
import { createConnection, type Connection } from "mysql2/promise";
import { databaseQueries } from "./queries";

export class Database {
  private _connection: Connection | null = null;
  queries = databaseQueries;

  async connect() {
    this._connection = await createConnection({
      database: env.DB_NAME,
      host: env.DB_HOST,
      password: env.DB_PASS,
      port: env.DB_PORT,
      user: env.DB_USER,
    });

    return this;
  }

  getConnection() {
    if (this._connection === null)
      throw new Error("Database is not connected!");

    return this._connection;
  }

  async sql<T>(query: TemplateStringsArray, ...values: unknown[]) {
    console.log(
      "\x1b[40m\x1b[35mSQL call:\n",
      "DB statement: \x1b[33m",
      query.join("?").trim(),
      "\n\x1b[35mDB values: \x1b[33m",
      values.join(", "),
      "\n\x1b[35mDB query: \x1b[33m",
      zip(query, values)
        .map(l => l.join(""))
        .join("")
        .trim(),
      "\x1b[0m",
    );

    const [result] = await this.getConnection().execute(
      query.join("?"),
      values,
    );

    return result as T;
  }

  async beginTransaction() {
    return await this.getConnection().beginTransaction();
  }

  async commit() {
    return await this.getConnection().commit();
  }

  async rollback() {
    return await this.getConnection().rollback();
  }
}

export const db = await new Database().connect();
