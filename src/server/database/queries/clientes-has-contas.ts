import { db } from "..";

export type ClientesHasContas = {
  clientes_cpf: string;
  contas_num_conta: number;
};

export async function getByNumero(numero: number) {
  return db.sql<Array<ClientesHasContas>>`
    SELECT * FROM clientes_has_contas WHERE contas_num_conta = ${numero}
  `;
}
