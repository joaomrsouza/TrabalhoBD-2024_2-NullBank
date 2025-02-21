// 3. Dada uma cidade, deseja-se saber:

import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type CountResponse } from "..";
import { db } from "../..";

type CidadesParams = z.infer<typeof schemas.consultas.cidades.cidadesParams>;

// 3.1. Quais os nomes e endereços dos clientes que moram naquela cidade, ordenando-os por idade;

export type CidadeClientes = {
  cidade: string;
  data_nasc: Date;
  end_bairro: string;
  end_cep: string;
  end_estado: string;
  end_logradouro: string;
  end_numero: number;
  end_tipo: string;
  idade: number;
  nome: string;
};

export async function clientes(params: CidadesParams): Promise<{
  count: number;
  data: Array<CidadeClientes>;
}> {
  const { cidade, skip, take } = params;

  if (cidade === undefined) return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<CidadeClientes>>`
      SELECT
        data_nasc,
        end_bairro,
        end_cep,
        end_estado,
        end_logradouro,
        end_numero,
        end_tipo,
        end_cidade AS cidade,
        nome,
        (
          TIMESTAMPDIFF(YEAR, data_nasc, CURDATE())
        ) AS idade
      FROM clientes
      WHERE end_cidade LIKE CONCAT('%', ${cidade}, '%')
      ORDER BY idade DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM clientes
      WHERE end_cidade LIKE CONCAT('%', ${cidade}, '%')
    `,
  ]);

  return { count: count[0].count, data };
}

// 3.2. Quais os nomes, endereços, cargos, salários e agências dos funcionários que trabalham naquela cidade, agrupando-os por agência, por cargo e por salário;

export type CidadeFuncionarios = {
  agencias_nome: string;
  agencias_num_ag: number;
  cargo: string;
  cidade: string;
  endereco: string;
  nome: string;
  salario: number;
};

export async function funcionarios(params: CidadesParams): Promise<{
  count: number;
  data: Array<CidadeFuncionarios>;
}> {
  const { cidade, skip, take } = params;

  if (cidade === undefined) return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<CidadeFuncionarios>>`
      SELECT
        f.nome,
        f.endereco,
        f.cargo,
        f.salario,
        f.agencias_num_ag,
        f.cidade,
        a.nome_ag AS agencias_nome
      FROM funcionarios f
        JOIN agencias a
          ON f.agencias_num_ag = a.num_ag
      WHERE f.cidade LIKE CONCAT('%', ${cidade}, '%')
      ORDER BY
        f.agencias_num_ag ASC,
        f.cargo ASC,
        f.salario DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM funcionarios f
        JOIN agencias a
          ON f.agencias_num_ag = a.num_ag
      WHERE f.cidade LIKE CONCAT('%', ${cidade}, '%')
    `,
  ]);

  return { count: count[0].count, data };
}

// 3.3. Quais os nomes das agências e o salário montante total dos funcionários que trabalham naquelas agências, ordenando-os por salário montante total;

export type CidadeAgencias = {
  cidade: string;
  nome_ag: string;
  num_ag: number;
  sal_total: number;
};

export async function agencias(params: CidadesParams): Promise<{
  count: number;
  data: Array<CidadeAgencias>;
}> {
  const { cidade, skip, take } = params;

  if (cidade === undefined) return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<CidadeAgencias>>`
      SELECT
        num_ag,
        nome_ag,
        sal_total,
        cidade_ag AS cidade
      FROM agencias
      WHERE cidade_ag LIKE CONCAT('%', ${cidade}, '%')
      ORDER BY sal_total DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM agencias
      WHERE cidade_ag LIKE CONCAT('%', ${cidade}, '%')
    `,
  ]);

  return { count: count[0].count, data };
}
