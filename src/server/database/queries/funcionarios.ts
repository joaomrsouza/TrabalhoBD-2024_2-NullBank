import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { AuthService } from "@/server/services/auth";
import { type Cargo, type Genero } from "@/utils/enums";
import { type CountResponse, type OpResponse } from ".";
import { db } from "..";

export type Funcionario = {
  agencias_num_ag: number;
  cargo: Cargo;
  cidade: string;
  data_nasc: Date;
  endereco: string;
  genero: Genero;
  matricula: number;
  nome: string;
  salario: number;
  salt: string;
  senha: string;
};

export type FuncionarioUpsert = {
  data_nasc: string;
} & Omit<Funcionario, "data_nasc" | "matricula" | "salt">;

type FilteredPageParams = z.infer<typeof schemas.funcionario.searchParams>;

export async function getFilteredPage(params: FilteredPageParams): Promise<{
  count: number;
  funcionarios: Array<Funcionario>;
}> {
  const { matricula, nome, skip, take } = params;

  const searchNome = Number(!nome);
  const searchMatricula = Number(!matricula);

  const [funcionarios, countQuery] = await Promise.all([
    db.sql<Array<Funcionario>>`
      SELECT * FROM funcionarios
      WHERE
        (matricula = ${matricula ?? ""} OR ${searchMatricula} = 1)
        AND
        (nome LIKE CONCAT('%', ${nome ?? ""}, '%') OR ${searchNome} = 1)
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) AS count FROM funcionarios
      WHERE
        (matricula = ${matricula ?? ""} OR ${searchMatricula} = 1)
        AND
        (nome LIKE CONCAT('%', ${nome ?? ""}, '%') OR ${searchNome} = 1)
    `,
  ]);

  return {
    count: countQuery[0].count,
    funcionarios,
  };
}

export async function getByMatricula(matricula: number) {
  const result = await db.sql<Array<Funcionario>>`
    SELECT * FROM funcionarios WHERE matricula = ${matricula}
  `;

  return result[0] ?? null;
}

export async function getNomeByMatricula(matricula: number) {
  const result = await db.sql<Array<Pick<Funcionario, "nome">>>`
    SELECT nome FROM funcionarios WHERE matricula = ${matricula}
  `;

  return result[0] ?? null;
}

export async function insert(data: FuncionarioUpsert) {
  const { hash: senha, salt } = await AuthService.hashPassword(data.senha);

  const result = await db.sql<OpResponse>`
    INSERT INTO funcionarios
      (agencias_num_ag, cargo, cidade, data_nasc, endereco, genero, nome, salario, salt, senha)
    VALUES
      (${data.agencias_num_ag}, ${data.cargo}, ${data.cidade}, ${data.data_nasc}, ${data.endereco}, ${data.genero}, ${data.nome}, ${data.salario}, ${salt.toString("base64")}, ${senha.toString("base64")})
  `;

  const newFuncionario = await db.sql<Array<Funcionario>>`
    SELECT * FROM funcionarios WHERE matricula = ${result.insertId}
  `;

  return newFuncionario[0] ?? null;
}

export async function updateByMatricula(
  matricula: number,
  data: { senha?: string } & Omit<FuncionarioUpsert, "senha">,
) {
  if (data.senha) {
    const { hash: senha, salt } = await AuthService.hashPassword(data.senha);

    await db.sql`
      UPDATE funcionarios SET
        agencias_num_ag = ${data.agencias_num_ag},
        cargo = ${data.cargo},
        cidade = ${data.cidade},
        data_nasc = ${data.data_nasc},
        endereco = ${data.endereco},
        genero = ${data.genero},
        nome = ${data.nome},
        salario = ${data.salario},
        salt = ${salt.toString("base64")},
        senha = ${senha.toString("base64")}
      WHERE matricula = ${matricula}
    `;
  } else {
    await db.sql`
      UPDATE funcionarios SET
        agencias_num_ag = ${data.agencias_num_ag},
        cargo = ${data.cargo},
        cidade = ${data.cidade},
        data_nasc = ${data.data_nasc},
        endereco = ${data.endereco},
        genero = ${data.genero},
        nome = ${data.nome},
        salario = ${data.salario}
      WHERE matricula = ${matricula}
    `;
  }

  const updatedFuncionario = await db.sql<Array<Funcionario>>`
    SELECT * FROM funcionarios WHERE matricula = ${matricula}
  `;

  return updatedFuncionario[0] ?? null;
}

export async function deleteByMatricula(matricula: number) {
  await db.sql`
    DELETE FROM funcionarios
    WHERE matricula = ${matricula}
  `;
}
