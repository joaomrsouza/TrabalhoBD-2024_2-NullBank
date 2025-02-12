import { db } from "..";

export const TiposConta = ["especial", "corrente", "poupança"] as const;
export type TipoConta = (typeof TiposConta)[number];

export type Conta = {
  agencias_num_ag: number;
  funcionarios_matricula_gerente: number;
  num_conta: number;
  saldo: number;
  salt: string;
  senha: string;
  tipo: TipoConta;
};

export type ClientesHasContas = {
  clientes_cpf: string;
  contas_num_conta: number;
};

export async function getByClienteBasic(cpf: string) {
  return await db.sql<Array<Pick<Conta, "agencias_num_ag" | "num_conta">>>`
    SELECT agencias_num_ag, num_conta FROM clientes_has_contas JOIN contas ON contas_num_conta = num_conta WHERE clientes_cpf = ${cpf}
  `;
}

export async function getByCliente(cpf: string) {
  return await db.sql<Array<Conta & ClientesHasContas>>`
    SELECT * FROM clientes_has_contas JOIN contas ON contas_num_conta = num_conta WHERE clientes_cpf = ${cpf}
  `;
}

export async function getByNumero(numero: number) {
  const result = await db.sql<Array<Conta>>`
    SELECT * FROM contas WHERE num_conta = ${numero}
  `;

  return result[0] ?? null;
}
