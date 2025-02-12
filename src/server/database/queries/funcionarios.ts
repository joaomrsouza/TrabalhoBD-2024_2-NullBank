import { db } from "..";

export const Generos = ["masculino", "feminino", "não-binário"] as const;
export type Genero = (typeof Generos)[number];

export const Cargos = ["gerente", "atendente", "caixa"] as const;
export type Cargo = (typeof Cargos)[number];

export type Funcionario = {
  agencias_num_ag: number;
  cargo: Cargo;
  cidade: string;
  data_nasc: string;
  endereco: string;
  genero: Genero;
  matricula: number;
  nome: string;
  salario: number;
  salt: string;
  senha: string;
};

export async function getAll() {
  return await db.sql<Array<Funcionario>>`
    SELECT * FROM funcionarios
  `;
}

export async function getByMatricula(matricula: number) {
  const result = await db.sql<Array<Funcionario>>`
    SELECT * FROM funcionarios WHERE matricula = ${matricula}
  `;

  return result[0] ?? null;
}
