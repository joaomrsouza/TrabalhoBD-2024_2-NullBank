// Criar uma visão para listar os dados das contas de um gerente, com seus tipos, saldos e clientes;

import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type CountResponse } from "..";
import { db } from "../..";

type GerenteParams = z.infer<
  typeof schemas.consultas.contasPorGerente.gerenteParams
>;

export type ContasPorGerente = {
  cpf: string;
  funcionarios_matricula_gerente: number;
  nome: string;
  num_conta: number;
  saldo: number;
  tipo: string;
};

export async function query(params: GerenteParams): Promise<{
  count: number;
  data: Array<ContasPorGerente>;
}> {
  const { funcionarios_matricula_gerente, skip, take } = params;

  if (funcionarios_matricula_gerente === undefined)
    return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<ContasPorGerente>>`
      SELECT *
      FROM contas_por_gerente
      WHERE funcionarios_matricula_gerente = ${funcionarios_matricula_gerente}
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM contas_por_gerente
      WHERE funcionarios_matricula_gerente = ${funcionarios_matricula_gerente}
    `,
  ]);

  return { count: count[0].count, data };
}
