// 1. Dado o nome / número de uma agência, deseja-se saber:

import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type CountResponse } from "..";
import { db } from "../..";

// 1.1. Quais os funcionários, seus cargos e seus endereços, cidades, seus salários e o número de dependentes de cada um, podendo ser classificados por ordem alfabética de nomes ou de salários;

export type AgenciaFuncionarios = {
  agencias_num_ag: number;
  cargo: string;
  cidade: string;
  dependentes: number;
  endereco: string;
  nome: string;
  salario: number;
};

type AgenciaParams = z.infer<typeof schemas.consultas.agencias.agenciaParams>;
type AgenciaLastXDaysParams = z.infer<
  typeof schemas.consultas.agencias.agenciaLastXDaysParams
>;

export async function funcionarios(params: AgenciaParams): Promise<{
  count: number;
  data: Array<AgenciaFuncionarios>;
}> {
  const { agencias_num_ag, orderBy, skip, take } = params;

  if (agencias_num_ag === undefined) return { count: 0, data: [] };

  let dataQuery: Promise<Array<AgenciaFuncionarios>> = Promise.resolve([]);

  if (orderBy?.field === "nome" && orderBy?.order === "asc")
    dataQuery = db.sql<Array<AgenciaFuncionarios>>`
      SELECT
        f.agencias_num_ag,
        f.nome,
        f.cargo,
        f.endereco,
        f.cidade,
        f.salario,
        (
          SELECT COUNT(*)
          FROM dependentes
          WHERE funcionarios_matricula = f.matricula
        ) AS dependentes
      FROM funcionarios f
      WHERE agencias_num_ag = ${agencias_num_ag}
      ORDER BY f.nome ASC
      LIMIT ${String(skip)}, ${String(take)}
    `;

  if (orderBy?.field === "nome" && orderBy?.order === "desc")
    dataQuery = db.sql<Array<AgenciaFuncionarios>>`
      SELECT
        f.agencias_num_ag,
        f.nome,
        f.cargo,
        f.endereco,
        f.cidade,
        f.salario,
        (
          SELECT COUNT(*)
          FROM dependentes
          WHERE funcionarios_matricula = f.matricula
        ) AS dependentes
      FROM funcionarios f
      WHERE agencias_num_ag = ${agencias_num_ag}
      ORDER BY f.nome DESC
      LIMIT ${String(skip)}, ${String(take)}
    `;

  if (orderBy?.field === "salario" && orderBy?.order === "asc")
    dataQuery = db.sql<Array<AgenciaFuncionarios>>`
      SELECT
        f.agencias_num_ag,
        f.nome,
        f.cargo,
        f.endereco,
        f.cidade,
        f.salario,
        (
          SELECT COUNT(*)
          FROM dependentes
          WHERE funcionarios_matricula = f.matricula
        ) AS dependentes
      FROM funcionarios f
      WHERE agencias_num_ag = ${agencias_num_ag}
      ORDER BY f.salario ASC
      LIMIT ${String(skip)}, ${String(take)}
    `;

  if (orderBy?.field === "salario" && orderBy?.order === "desc")
    dataQuery = db.sql<Array<AgenciaFuncionarios>>`
      SELECT
        f.agencias_num_ag,
        f.nome,
        f.cargo,
        f.endereco,
        f.cidade,
        f.salario,
        (
          SELECT COUNT(*)
          FROM dependentes
          WHERE funcionarios_matricula = f.matricula
        ) AS dependentes
      FROM funcionarios f
      WHERE agencias_num_ag = ${agencias_num_ag}
      ORDER BY f.salario DESC
      LIMIT ${String(skip)}, ${String(take)}
    `;

  const countQuery = db.sql<CountResponse>`
    SELECT COUNT(*) as count
    FROM funcionarios
    WHERE agencias_num_ag = ${agencias_num_ag}
  `;

  const [data, count] = await Promise.all([dataQuery, countQuery]);

  return { count: count[0].count, data };
}

// 1.2. Quais os clientes daquela agência, classificando-os por tipo de conta;

export type AgenciaClientes = {
  agencias_num_ag: number;
  nome: string;
  num_conta: number;
  tipo: string;
};

export async function clientes(params: AgenciaParams): Promise<{
  count: number;
  data: Array<AgenciaClientes>;
}> {
  const { agencias_num_ag, orderBy, skip, take } = params;

  if (agencias_num_ag === undefined) return { count: 0, data: [] };

  let dataQuery: Promise<Array<AgenciaClientes>> = Promise.resolve([]);

  if (orderBy?.field === "tipo" && orderBy.order === "asc")
    dataQuery = db.sql<Array<AgenciaClientes>>`
      SELECT co.agencias_num_ag, cl.nome, co.num_conta, co.tipo
      FROM contas co
        JOIN clientes_has_contas cohcl
          ON co.num_conta = cohcl.contas_num_conta
        JOIN clientes cl
          ON cohcl.clientes_cpf = cl.cpf
      WHERE co.agencias_num_ag = ${agencias_num_ag}
      ORDER BY co.tipo ASC
      LIMIT ${String(skip)}, ${String(take)}
    `;

  if (orderBy?.field === "tipo" && orderBy.order === "desc")
    dataQuery = db.sql<Array<AgenciaClientes>>`
      SELECT co.agencias_num_ag, cl.nome, co.num_conta, co.tipo
      FROM contas co
        JOIN clientes_has_contas cohcl
          ON co.num_conta = cohcl.contas_num_conta
        JOIN clientes cl
          ON cohcl.clientes_cpf = cl.cpf
      WHERE co.agencias_num_ag = ${agencias_num_ag}
      ORDER BY co.tipo DESC
      LIMIT ${String(skip)}, ${String(take)}
    `;

  const countQuery = db.sql<CountResponse>`
    SELECT COUNT(*) as count
    FROM funcionarios
    WHERE agencias_num_ag = ${agencias_num_ag}
  `;

  const [data, count] = await Promise.all([dataQuery, countQuery]);

  return { count: count[0].count, data };
}

// 1.3. Quais são as contas especiais com maior saldo devedor (mostrar todas as contas, ordenando do maior saldo devedor para o menor);

export type AgenciaContasEspeciais = {
  agencias_num_ag: number;
  limite_credito: number;
  num_conta: number;
  saldo: number;
};

export async function contasEspeciais(params: AgenciaParams): Promise<{
  count: number;
  data: Array<AgenciaContasEspeciais>;
}> {
  const { agencias_num_ag, skip, take } = params;

  if (agencias_num_ag === undefined) return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<AgenciaContasEspeciais>>`
      SELECT c.agencias_num_ag, c.num_conta, c.saldo, ce.limite_credito
      FROM contas c
        JOIN contas_especial ce
          ON c.num_conta = ce.contas_num_conta
      WHERE
        c.agencias_num_ag = ${agencias_num_ag}
        AND
        c.tipo = 'especial'
      ORDER BY limite_credito DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM contas
      WHERE
        agencias_num_ag = ${agencias_num_ag}
        AND
        tipo = 'especial'
    `,
  ]);

  return { count: count[0].count, data };
}

// 1.4. Quais são as contas poupança com maior saldo positivo, classificando-as;

export type AgenciaContasPoupanca = {
  agencias_num_ag: number;
  num_conta: number;
  saldo: number;
};

export async function contasPoupanca(params: AgenciaParams): Promise<{
  count: number;
  data: Array<AgenciaContasPoupanca>;
}> {
  const { agencias_num_ag, skip, take } = params;

  if (agencias_num_ag === undefined) return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<AgenciaContasPoupanca>>`
      SELECT agencias_num_ag, num_conta, saldo
      FROM contas
      WHERE
        agencias_num_ag = ${agencias_num_ag}
        AND
        tipo = 'poupança'
      ORDER BY saldo DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM contas
      WHERE
        agencias_num_ag = ${agencias_num_ag}
        AND
        tipo = 'poupança'
    `,
  ]);

  return { count: count[0].count, data };
}

// 1.5. Quais as contas correntes com maior número de transações na última semana (últimos 7 dias), no último mês (últimos 30 dias) e no último ano (últimos 365 dias);

export type AgenciaContasCorrenteTransacoesQtd = {
  agencias_num_ag: number;
  last_x_days: number;
  num_conta: number;
  qtd_transacoes: number;
};

export async function contasCorrenteTransacoesQtd(
  params: AgenciaLastXDaysParams,
): Promise<{
  count: number;
  data: Array<AgenciaContasCorrenteTransacoesQtd>;
}> {
  const { agencias_num_ag, last_x_days, skip, take } = params;

  if (agencias_num_ag === undefined || last_x_days === undefined)
    return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<AgenciaContasCorrenteTransacoesQtd>>`
      SELECT
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
      WHERE
        c.agencias_num_ag = ${agencias_num_ag}
        AND
        tipo = 'corrente'
      ORDER BY qtd_transacoes DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM contas c
      WHERE
        c.agencias_num_ag = ${agencias_num_ag}
        AND
        tipo = 'corrente'
    `,
  ]);

  return { count: count[0].count, data };
}

// 1.6. Quais as contas com maior volume (valor total) de movimentações na última semana (últimos 7 dias), no último mês (últimos 30 dias) e no último ano (últimos 365 dias);

export type AgenciaContasCorrenteTransacoesValor = {
  agencias_num_ag: number;
  last_x_days: number;
  num_conta: number;
  valor_transacoes: number;
};

export async function contasCorrenteTransacoesValor(
  params: AgenciaLastXDaysParams,
): Promise<{
  count: number;
  data: Array<AgenciaContasCorrenteTransacoesValor>;
}> {
  const { agencias_num_ag, last_x_days, skip, take } = params;

  if (agencias_num_ag === undefined || last_x_days === undefined)
    return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<AgenciaContasCorrenteTransacoesValor>>`
      SELECT
        c.agencias_num_ag,
        c.num_conta,
        (
          SELECT SUM(valor)
          FROM transacoes t
          WHERE
            t.contas_num_conta_origem = c.num_conta
            AND
            t.data_hora >= DATE(NOW() - INTERVAL ${last_x_days} DAY)
        ) AS valor_transacoes
      FROM contas c
      WHERE
        c.agencias_num_ag = ${agencias_num_ag}
        AND
        tipo = 'corrente'
      ORDER BY valor_transacoes DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM contas c
      WHERE
        c.agencias_num_ag = ${agencias_num_ag}
        AND
        tipo = 'corrente'
    `,
  ]);

  return { count: count[0].count, data };
}
