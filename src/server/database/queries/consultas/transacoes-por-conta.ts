// Criar uma visão para listar, para cada conta, todos os dados das movimentações das mesmas (estilo extrato, podem ser na última semana (últimos 7 dias), no último mês (últimos 30 dias) e no último ano (últimos 365 dias);

import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type CountResponse } from "..";
import { db } from "../..";

type ContaLastXDaysParams = z.infer<
  typeof schemas.consultas.transacoesPorConta.contaLastXDaysParams
>;

export type TransacoesPorConta = {
  contas_num_conta_destino: number;
  data_hora: Date;
  last_x_days: number;
  num_conta: number;
  num_transacao: number;
  tipo: string;
  valor: number;
};

export async function query(params: ContaLastXDaysParams): Promise<{
  count: number;
  data: Array<TransacoesPorConta>;
}> {
  const { last_x_days, num_conta, skip, take } = params;

  if (num_conta === undefined || last_x_days === undefined)
    return { count: 0, data: [] };

  const [data, count] = await Promise.all([
    db.sql<Array<TransacoesPorConta>>`
      SELECT *
      FROM transacoes_por_conta
      WHERE
        num_conta = ${num_conta}
        AND
        data_hora >= DATE(NOW() - INTERVAL ${last_x_days} DAY)
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) as count
      FROM transacoes_por_conta
      WHERE
        num_conta = ${num_conta}
        AND
        data_hora >= DATE(NOW() - INTERVAL ${last_x_days} DAY)
    `,
  ]);

  return { count: count[0].count, data };
}
