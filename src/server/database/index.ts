import "server-only";

import { zip } from "lodash";
import { createConnection, type Connection } from "mysql2/promise";
import { databaseQueries } from "./queries";

export class Database {
  private _connection: Connection | null = null;
  queries = databaseQueries;

  async connect() {
    this._connection = await createConnection({
      database: "equipe521459",
      host: "localhost",
      password: "root",
      user: "root",
    });

    return this;
  }

  getConnection() {
    if (this._connection === null)
      throw new Error("Database is not connected!");

    return this._connection;
  }

  getBuilder() {
    return new QueryBuilder();
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

  async execute<T>(queryBuilder: QueryBuilder) {
    const { appends, query, values } = queryBuilder.getExecuteParams();
    const finalQuery = query.join("?").trim().concat(" ", appends.join("\n"));

    console.log(
      "\x1b[40m\x1b[35mExecute call:\n",
      "DB statement: \x1b[33m",
      finalQuery.trim(),
      "\n\x1b[35mDB values: \x1b[33m",
      values.join(", "),
      "\n\x1b[35mDB query: \x1b[33m",
      zip(query, values)
        .map(l => l.join(""))
        .join("")
        .trim()
        .concat(" ", appends.join("\n")),
      "\x1b[0m",
    );

    const [result] = await this.getConnection().execute(finalQuery, values);

    return result as T;
  }
}

class QueryBuilder {
  private _query: Array<string> = [];
  private _values: Array<unknown> = [];
  private _appends: Array<string> = [];

  sql(query: TemplateStringsArray, ...values: unknown[]) {
    this._query = [...query];
    this._values = [...this._values, ...values];
    return this;
  }

  rawAppend(query: string) {
    this._appends.push(query);
    return this;
  }

  getExecuteParams() {
    return {
      appends: this._appends,
      query: this._query,
      values: this._values,
    };
  }
}

export const db = await new Database().connect();
