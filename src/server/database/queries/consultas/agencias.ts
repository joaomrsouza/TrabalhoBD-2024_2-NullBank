// 1. Dado o nome / número de uma agência, deseja-se saber:

import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
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

type funcionariosParams = z.infer<
  typeof schemas.consultas.agencias.funcionariosParams
>;

export async function funcionarios(params: funcionariosParams) {
  const { agencias_num_ag, orderBy, skip, take } = params;

  if (agencias_num_ag === undefined) return [];

  if (orderBy?.field === "nome" && orderBy?.order === "asc")
    return db.sql<Array<AgenciaFuncionarios>>`
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
    return db.sql<Array<AgenciaFuncionarios>>`
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
    return db.sql<Array<AgenciaFuncionarios>>`
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
    return db.sql<Array<AgenciaFuncionarios>>`
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

  return [];
}

// TODO: 1.2. Quais os clientes daquela agência, classificando-os por tipo de conta;
// TODO: 1.3. Quais são as contas especiais com maior saldo devedor (mostrar todas as contas, ordenando do maior saldo devedor para o menor);
// TODO: 1.4. Quais são as contas poupança com maior saldo positivo, classificando-as;
// TODO: 1.5. Quais as contas correntes com maior número de transações na última semana (últimos 7 dias), 4
// TODO: no último mês (últimos 30 dias) e no último ano (últimos 365 dias);
// TODO: 1.6. Quais as contas com maior volume (valor total) de movimentações na última semana (últimos 7 dias), no último mês (últimos 30 dias) e no último ano (últimos 365 dias);
