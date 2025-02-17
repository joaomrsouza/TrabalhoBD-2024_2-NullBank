import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type CountResponse, type OpResponse } from ".";
import { db } from "..";

export const Parentescos = ["filho(a)", "cônjuge", "genitor(a)"] as const;
export type Parentesco = (typeof Parentescos)[number];

export type Dependente = {
  data_nasc: Date;
  funcionario_matricula: number;
  idade: number;
  nome_dependente: string;
  parentesco: Parentesco;
};

export type DependenteUpsert = {
  data_nasc: string;
} & Omit<Dependente, "data_nasc" | "idade">;

type FilteredPageParams = z.infer<typeof schemas.dependente.searchParams>;

export async function getFilteredPage(params: FilteredPageParams): Promise<{
  count: number;
  dependentes: Array<Dependente>;
}> {
  const { nome_dependente, skip, take } = params;

  const searchNome = Number(!nome_dependente);

  const [dependentes, countQuery] = await Promise.all([
    db.sql<Array<Dependente>>`
      SELECT * FROM dependentes
      WHERE
        (nome_dependente LIKE CONCAT('%', ${nome_dependente ?? ""}, '%') OR ${searchNome} = 1)
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) AS count FROM dependentes
      WHERE
        (nome_dependente LIKE CONCAT('%', ${nome_dependente ?? ""}, '%') OR ${searchNome} = 1)
    `,
  ]);

  return {
    count: countQuery[0].count,
    dependentes,
  };
}

export async function getByNomeDependente(nomeDependente: string) {
  const result = await db.sql<Array<Dependente>>`
    SELECT * FROM dependentes WHERE nome_dependente = ${nomeDependente}
  `;

  return result[0] ?? null;
}

export async function insert(data: DependenteUpsert) {
  const result = await db.sql<OpResponse>`
    INSERT INTO dependentes
      (data_nasc, funcionario_matricula, nome_dependente, parentesco)
    VALUES
      (${data.data_nasc}, ${data.funcionario_matricula}, ${data.nome_dependente}, ${data.parentesco})
  `;

  const newDependente = await db.sql<Array<Dependente>>`
    SELECT * FROM dependentes WHERE cpf = ${result.insertId}
  `;

  return newDependente[0] ?? null;
}

export async function updateByNomeDependente(
  nomeDependente: string,
  data: Omit<DependenteUpsert, "nome_dependente">,
) {
  await db.sql`
    UPDATE dependentes SET
      data_nasc = ${data.data_nasc},
      funcionario_matricula = ${data.funcionario_matricula},
      parentesco = ${data.parentesco}
    WHERE nome_dependente = ${nomeDependente}
  `;

  const updatedDependente = await db.sql<Array<Dependente>>`
    SELECT * FROM dependentes WHERE nome_dependente = ${nomeDependente}
  `;

  return updatedDependente[0] ?? null;
}

export async function deleteByNomeDependente(nomeDependente: string) {
  await db.sql`
    DELETE FROM dependentes
    WHERE nome_dependente = ${nomeDependente}
  `;
}
