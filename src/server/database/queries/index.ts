import * as agencias from "./agencias";
import * as clientes from "./clientes";
import { consultas } from "./consultas";
import * as contas from "./contas";
import * as dependentes from "./dependentes";
import * as funcionarios from "./funcionarios";

export type OpResponse = {
  affectedRows: number;
  changedRows: number;
  fieldCount: number;
  info: string;
  insertId: number;
  serverStatus: number;
  warningStatus: number;
};

export type CountResponse = [{ count: number }];

export const databaseQueries = {
  agencias,
  clientes,
  consultas,
  contas,
  dependentes,
  funcionarios,
};
