import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type Parentesco } from "@/utils/enums";
import { type CountResponse } from ".";
import { db } from "..";

export type Dependente = {
  data_nasc: Date;
  funcionarios_matricula: number;
  idade: number;
  nome_dependente: string;
  parentesco: Parentesco;
};

export type DependenteUpsert = {
  data_nasc: string;
} & Omit<Dependente, "data_nasc" | "funcionarios_matricula" | "idade">;

type FilteredPageParams = z.infer<typeof schemas.dependente.searchParams>;

export async function getFilteredPage(
  matricula: number,
  params: FilteredPageParams,
): Promise<{
  count: number;
  dependentes: Array<Dependente>;
}> {
  const { nome_dependente, skip, take } = params;

  const searchNome = Number(!nome_dependente);

  const [dependentes, countQuery] = await Promise.all([
    db.sql<Array<Dependente>>`
      SELECT * FROM dependentes
      WHERE
        funcionarios_matricula = ${matricula}
        AND
        (nome_dependente LIKE CONCAT('%', ${nome_dependente ?? ""}, '%') OR ${searchNome} = 1)
      ORDER BY nome_dependente ASC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) AS count FROM dependentes
      WHERE
        funcionarios_matricula = ${matricula}
        AND
        (nome_dependente LIKE CONCAT('%', ${nome_dependente ?? ""}, '%') OR ${searchNome} = 1)
    `,
  ]);

  return {
    count: countQuery[0].count,
    dependentes,
  };
}

export async function getByNomeDependente(
  matricula: number,
  nomeDependente: string,
) {
  const result = await db.sql<Array<Dependente>>`
    SELECT * FROM dependentes
    WHERE
      funcionarios_matricula = ${matricula}
      AND
      nome_dependente = ${nomeDependente}
  `;

  return result[0] ?? null;
}

export async function insert(matricula: number, data: DependenteUpsert) {
  await db.sql`
    INSERT INTO dependentes
      (funcionarios_matricula, data_nasc, nome_dependente, parentesco)
    VALUES
      (${matricula}, ${data.data_nasc}, ${data.nome_dependente}, ${data.parentesco})
  `;

  const newDependente = await db.sql<Array<Dependente>>`
    SELECT * FROM dependentes
    WHERE
      funcionarios_matricula = ${matricula}
      AND
      nome_dependente = ${data.nome_dependente}
  `;

  return newDependente[0] ?? null;
}

export async function updateByNomeDependente(
  matricula: number,
  nomeDependente: string,
  data: Omit<DependenteUpsert, "nome_dependente">,
) {
  await db.sql`
    UPDATE dependentes SET
      data_nasc = ${data.data_nasc},
      parentesco = ${data.parentesco}
    WHERE
      funcionarios_matricula = ${matricula}
      AND
      nome_dependente = ${nomeDependente}
  `;

  const updatedDependente = await db.sql<Array<Dependente>>`
    SELECT * FROM dependentes
    WHERE
      funcionarios_matricula = ${matricula}
      AND
      nome_dependente = ${nomeDependente}
  `;

  return updatedDependente[0] ?? null;
}

export async function deleteByNomeDependente(
  matricula: number,
  nomeDependente: string,
) {
  await db.sql`
    DELETE FROM dependentes
    WHERE
      funcionarios_matricula = ${matricula}
      AND
      nome_dependente = ${nomeDependente}
  `;
}
