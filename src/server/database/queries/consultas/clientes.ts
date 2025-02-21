// 2. Dado um cliente (seu CPF), deseja-se saber:

import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type CountResponse } from "..";
import { db } from "../..";

type ClienteParams = z.infer<typeof schemas.consultas.clientes.clienteParams>;
type ClienteLastXDaysParams = z.infer<
  typeof schemas.consultas.clientes.clienteLastXDaysParams
>;

// 2.1. Quais as contas do mesmo, com seus tipos, suas agências, seus gerentes e seus saldos atuais;

export type ClienteContas = {
  agencias_num_ag: number;
  clientes_cpf: string;
  funcionarios_matricula_gerente: number;
  funcionarios_nome_gerente: string;
  num_conta: number;
  saldo: number;
  tipo: string;
};

export async function contas(params: ClienteParams): Promise<{
  count: number;
  data: Array<ClienteContas>;
}> {
  const { clientes_cpf, skip, take } = params;

  if (clientes_cpf === undefined) return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<ClienteContas>>`
      SELECT
        chc.clientes_cpf,
        c.num_conta,
        c.tipo,
        c.agencias_num_ag,
        c.funcionarios_matricula_gerente,
        f.nome AS funcionarios_nome_gerente,
        c.saldo
      FROM clientes_has_contas chc
        JOIN contas c
          ON chc.contas_num_conta = c.num_conta
        JOIN funcionarios f
          ON c.funcionarios_matricula_gerente = f.matricula
      WHERE chc.clientes_cpf = ${clientes_cpf}
      ORDER BY c.num_conta ASC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM clientes_has_contas
      WHERE clientes_cpf = ${clientes_cpf}
    `,
  ]);

  return { count: count[0].count, data };
}

// 2.2. Quais os nomes dos clientes e seus CPFs com os quais aquele cliente possui contas conjuntas;

export type ClienteContasConjunta = {
  clientes_cpf: string;
  cpf: string;
  nome: string;
};

export async function contasConjunta(params: ClienteParams): Promise<{
  count: number;
  data: Array<ClienteContasConjunta>;
}> {
  const { clientes_cpf, skip, take } = params;

  if (clientes_cpf === undefined) return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<ClienteContasConjunta>>`
      SELECT ${clientes_cpf} AS clientes_cpf, cpf, nome
      FROM clientes
      WHERE cpf IN (
        SELECT clientes_cpf
        FROM clientes_has_contas
        WHERE
          contas_num_conta IN (
            SELECT contas_num_conta
            FROM clientes_has_contas
            WHERE clientes_cpf = ${clientes_cpf}
          )
          AND
          clientes_cpf <> ${clientes_cpf}
      )
      ORDER BY cpf ASC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) AS count
        FROM clientes
        WHERE cpf IN (
          SELECT clientes_cpf
          FROM clientes_has_contas
          WHERE
            contas_num_conta IN (
              SELECT contas_num_conta
              FROM clientes_has_contas
              WHERE clientes_cpf = ${clientes_cpf}
            )
            AND
            clientes_cpf <> ${clientes_cpf}
        )
    `,
  ]);

  return { count: count[0].count, data };
}

// 2.3. Quais as contas correntes deste cliente com maior número de transações na última semana (últimos 7 dias), no último mês (últimos 30 dias) e no último ano (últimos 365 dias);

export type ClienteContasTransacoesQtd = {
  agencias_num_ag: number;
  clientes_cpf: string;
  last_x_days: number;
  num_conta: number;
  qtd_transacoes: number;
};

export async function contasTransacoesQtd(
  params: ClienteLastXDaysParams,
): Promise<{
  count: number;
  data: Array<ClienteContasTransacoesQtd>;
}> {
  const { clientes_cpf, last_x_days, skip, take } = params;

  if (clientes_cpf === undefined || last_x_days === undefined)
    return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<ClienteContasTransacoesQtd>>`
      SELECT
        chc.clientes_cpf,
        c.agencias_num_ag,
        c.num_conta,
        (
          SELECT COUNT(*)
          FROM transacoes t
          WHERE
            t.contas_num_conta_origem = c.num_conta
            AND
            t.data_hora >= DATE(NOW() - INTERVAL ${last_x_days} DAY)
        ) AS qtd_transacoes
      FROM contas c
        JOIN clientes_has_contas chc
          ON c.num_conta = chc.contas_num_conta
      WHERE chc.clientes_cpf = ${clientes_cpf}
      ORDER BY qtd_transacoes DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM contas c
        JOIN clientes_has_contas chc
          ON c.num_conta = chc.contas_num_conta
      WHERE chc.clientes_cpf = ${clientes_cpf}
    `,
  ]);

  return { count: count[0].count, data };
}

// 2.4. Quais as contas deste cliente com maior volume (valor total) de movimentações na última semana (últimos 7 dias), no último mês (últimos 30 dias) e no último ano (últimos 365 dias);

export type ClienteContasTransacoesValor = {
  agencias_num_ag: number;
  clientes_cpf: string;
  last_x_days: number;
  num_conta: number;
  valor_transacoes: number;
};

export async function contasTransacoesValor(
  params: ClienteLastXDaysParams,
): Promise<{
  count: number;
  data: Array<ClienteContasTransacoesValor>;
}> {
  const { clientes_cpf, last_x_days, skip, take } = params;

  if (clientes_cpf === undefined || last_x_days === undefined)
    return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<ClienteContasTransacoesValor>>`
      SELECT
        chc.clientes_cpf,
        c.agencias_num_ag,
        c.num_conta,
        (
          SELECT SUM(t.valor)
          FROM transacoes t
          WHERE
            t.contas_num_conta_origem = c.num_conta
            AND
            t.data_hora >= DATE(NOW() - INTERVAL ${last_x_days} DAY)
        ) AS valor_transacoes
      FROM contas c
        JOIN clientes_has_contas chc
          ON c.num_conta = chc.contas_num_conta
      WHERE chc.clientes_cpf = ${clientes_cpf}
      ORDER BY valor_transacoes DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM contas c
        JOIN clientes_has_contas chc
          ON c.num_conta = chc.contas_num_conta
      WHERE chc.clientes_cpf = ${clientes_cpf}
    `,
  ]);

  return { count: count[0].count, data };
}
