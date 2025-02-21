import * as agencias from "./agencias";
import * as clientes from "./clientes";
import * as clientesHasContas from "./clientes-has-contas";
import { consultas } from "./consultas";
import * as contas from "./contas";
import * as dependentes from "./dependentes";
import * as funcionarios from "./funcionarios";
import * as transacoes from "./transacoes";

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
  clientesHasContas,
  consultas,
  contas,
  dependentes,
  funcionarios,
  transacoes,
};
