import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type TipoTransacao } from "@/utils/enums";
import { type CountResponse, type OpResponse } from ".";
import { db } from "..";

export type Transacao = {
  contas_num_conta_destino: number | null;
  contas_num_conta_origem: number;
  data_hora: Date;
  num_transacao: number;
  tipo: TipoTransacao;
  valor: number;
};

export type TransacaoUpsert = Omit<Transacao, "data_hora" | "num_transacao">;

type FilteredPageParams = z.infer<typeof schemas.transacao.searchParams>;

export async function getFilteredPage(params: FilteredPageParams): Promise<{
  count: number;
  transacoes: Array<Transacao>;
}> {
  const { num_transacao, skip, take, tipo } = params;

  const searchTipo = Number(!tipo);
  const searchNumTransacao = Number(!num_transacao);

  const [transacoes, countQuery] = await Promise.all([
    db.sql<Array<Transacao>>`
      SELECT * FROM transacoes
      WHERE
        (num_transacao = ${num_transacao ?? ""} OR ${searchNumTransacao} = 1)
        AND
        (tipo = ${tipo ?? ""} OR ${searchTipo} = 1)
      ORDER BY data_hora DESC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) AS count FROM transacoes
      WHERE
        (num_transacao = ${num_transacao ?? ""} OR ${searchNumTransacao} = 1)
        AND
        (tipo = ${tipo ?? ""} OR ${searchTipo} = 1)
    `,
  ]);

  return {
    count: countQuery[0].count,
    transacoes,
  };
}

export async function getByNumero(numero: number) {
  const result = await db.sql<Array<Transacao>>`
    SELECT * FROM transacoes WHERE num_transacao = ${numero}
  `;

  return result[0] ?? null;
}

export async function insert(data: TransacaoUpsert) {
  const result = await db.sql<OpResponse>`
    INSERT INTO transacoes
      (contas_num_conta_destino, contas_num_conta_origem, tipo, valor)
    VALUES
      (${data.contas_num_conta_destino}, ${data.contas_num_conta_origem}, ${data.tipo}, ${data.valor})
  `;

  const newTransacao = await db.sql<Array<Transacao>>`
    SELECT * FROM transacoes WHERE num_transacao = ${result.insertId}
  `;

  return newTransacao[0] ?? null;
}

export async function updateByNumero(
  numero: number,
  data: Omit<TransacaoUpsert, "num_transacao">,
) {
  await db.sql`
    UPDATE transacoes SET
      contas_num_conta_origem = ${data.contas_num_conta_origem},
      contas_num_conta_destino = ${data.contas_num_conta_destino},
      tipo = ${data.tipo},
      valor = ${data.valor}
    WHERE num_transacao = ${numero}
  `;

  const updatedTransacao = await db.sql<Array<Transacao>>`
    SELECT * FROM transacoes WHERE num_transacao = ${numero}
  `;

  return updatedTransacao[0] ?? null;
}

export async function deleteByNumero(numero: number) {
  await db.sql`
    DELETE FROM transacoes
    WHERE num_transacao = ${numero}
  `;
}
