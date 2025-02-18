import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type CountResponse, type OpResponse } from ".";
import { db } from "..";

export type Agencia = {
  cidade_ag: string;
  nome_ag: string;
  num_ag: number;
  sal_total: number;
};

type FilteredPageParams = z.infer<typeof schemas.agencia.searchParams>;

export async function getFilteredPage(params: FilteredPageParams): Promise<{
  agencias: Array<Agencia>;
  count: number;
}> {
  const { cidade_ag, nome_ag, skip, take } = params;

  const searchNome = Number(!nome_ag);
  const searchCidade = Number(!cidade_ag);

  const [agencias, countQuery] = await Promise.all([
    db.sql<Array<Agencia>>`
      SELECT * FROM agencias
      WHERE
        (nome_ag LIKE CONCAT('%', ${nome_ag ?? ""}, '%') OR ${searchNome} = 1)
        AND
        (cidade_ag LIKE CONCAT('%', ${cidade_ag ?? ""}, '%') OR ${searchCidade} = 1)
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) AS count FROM agencias
      WHERE
        (nome_ag LIKE CONCAT('%', ${nome_ag ?? ""}, '%') OR ${searchNome} = 1)
        AND
        (cidade_ag LIKE CONCAT('%', ${cidade_ag ?? ""}, '%') OR ${searchCidade} = 1)
    `,
  ]);

  return {
    agencias,
    count: countQuery[0].count,
  };
}

export async function getByNumero(numero: number) {
  const result = await db.sql<Array<Agencia>>`
    SELECT * FROM agencias WHERE num_ag = ${numero}
  `;

  return result[0] ?? null;
}

export async function getNomeByNumero(numero: number) {
  const result = await db.sql<Array<Pick<Agencia, "nome_ag">>>`
    SELECT nome_ag FROM agencias WHERE num_ag = ${numero}
  `;

  return result[0] ?? null;
}

export async function insert(data: Pick<Agencia, "cidade_ag" | "nome_ag">) {
  const result = await db.sql<OpResponse>`
    INSERT INTO agencias
      (nome_ag, cidade_ag)
    VALUES
      (${data.nome_ag}, ${data.cidade_ag})
  `;

  const newAgencia = await db.sql<Array<Agencia>>`
    SELECT * FROM agencias WHERE num_ag = ${result.insertId}
  `;

  return newAgencia[0] ?? null;
}

export async function updateByNumero(
  numero: number,
  data: Pick<Agencia, "cidade_ag" | "nome_ag">,
) {
  await db.sql`
    UPDATE agencias SET
      nome_ag = ${data.nome_ag}, cidade_ag = ${data.cidade_ag}
    WHERE num_ag = ${numero}
  `;

  const updatedAgencia = await db.sql<Array<Agencia>>`
    SELECT * FROM agencias WHERE num_ag = ${numero}
  `;

  return updatedAgencia[0] ?? null;
}

export async function deleteByNumero(numero: number) {
  await db.sql`
    DELETE FROM agencias
    WHERE num_ag = ${numero}
  `;
}

export async function list(search: string) {
  const searchNome = Number(!search);

  const result = await db.sql<Array<Pick<Agencia, "nome_ag" | "num_ag">>>`
    SELECT num_ag, nome_ag FROM agencias
    WHERE
      (nome_ag LIKE CONCAT('%', ${search ?? ""}, '%') OR ${searchNome} = 1)
  `;

  return result;
}
