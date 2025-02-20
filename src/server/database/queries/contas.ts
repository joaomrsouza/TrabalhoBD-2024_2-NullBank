import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { AuthService } from "@/server/services/auth";
import { type TipoConta } from "@/utils/enums";
import { type CountResponse, type OpResponse } from ".";
import { db } from "..";

export type Conta = {
  agencias_num_ag: number;
  funcionarios_matricula_gerente: number;
  num_conta: number;
  saldo: number;
  salt: string;
  senha: string;
  tipo: TipoConta;
};

export type ClientesHasContas = {
  clientes_cpf: string;
  contas_num_conta: number;
};

export type ContaUpsert = Omit<Conta, "num_conta" | "saldo" | "salt">;

type FilteredPageParams = z.infer<typeof schemas.conta.searchParams>;

export async function getFilteredPage(params: FilteredPageParams): Promise<{
  contas: Array<Conta>;
  count: number;
}> {
  const { num_conta, skip, take, tipo } = params;

  const searchTipo = Number(!tipo);
  const searchNumConta = Number(!num_conta);

  const [contas, countQuery] = await Promise.all([
    db.sql<Array<Conta>>`
      SELECT * FROM contas
      WHERE
        (num_conta = ${num_conta ?? ""} OR ${searchNumConta} = 1)
        AND
        (tipo LIKE CONCAT('%', ${tipo ?? ""}, '%') OR ${searchTipo} = 1)
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) AS count FROM contas
      WHERE
        (num_conta = ${num_conta ?? ""} OR ${searchNumConta} = 1)
        AND
        (tipo = ${tipo} OR ${searchTipo} = 1)
    `,
  ]);

  return {
    contas,
    count: countQuery[0].count,
  };
}

export async function getByClienteBasic(cpf: string) {
  return await db.sql<Array<Pick<Conta, "agencias_num_ag" | "num_conta">>>`
    SELECT agencias_num_ag, num_conta FROM clientes_has_contas JOIN contas ON contas_num_conta = num_conta WHERE clientes_cpf = ${cpf}
  `;
}

export async function getByCliente(cpf: string) {
  return await db.sql<Array<Conta & ClientesHasContas>>`
    SELECT * FROM clientes_has_contas JOIN contas ON contas_num_conta = num_conta WHERE clientes_cpf = ${cpf}
  `;
}

export async function getByNumero(numero: number) {
  const result = await db.sql<Array<Conta>>`
    SELECT * FROM contas WHERE num_conta = ${numero}
  `;

  return result[0] ?? null;
}

export async function insert(data: ContaUpsert) {
  const { hash: senha, salt } = await AuthService.hashPassword(data.senha);

  const result = await db.sql<OpResponse>`
    INSERT INTO contas
      (agencias_num_ag, funcionarios_matricula_gerente, salt, senha, tipo)
    VALUES
      (${data.agencias_num_ag}, ${data.funcionarios_matricula_gerente}, ${salt}, ${senha}, ${data.tipo})
  `;

  // TODO: Criar e manusear os tipos de conta

  const newConta = await db.sql<Array<Conta>>`
    SELECT * FROM contas WHERE num_conta = ${result.insertId}
  `;

  return newConta[0] ?? null;
}

export async function updateByNumero(
  numero: number,
  data: { senha?: string } & Omit<ContaUpsert, "senha">,
) {
  if (data.senha) {
    const { hash: senha, salt } = await AuthService.hashPassword(data.senha);

    await db.sql`
      UPDATE contas SET
        agencias_num_ag = ${data.agencias_num_ag},
        funcionarios_matricula_gerente = ${data.funcionarios_matricula_gerente},
        senha = ${senha},
        salt = ${salt},
        tipo = ${data.tipo},
      WHERE num_conta = ${numero}
    `;
  } else {
    await db.sql`
      UPDATE contas SET
        agencias_num_ag = ${data.agencias_num_ag},
        funcionarios_matricula_gerente = ${data.funcionarios_matricula_gerente},
        tipo = ${data.tipo},
      WHERE num_conta = ${numero}
    `;
  }

  // TODO: Criar e manusear os tipos de conta

  const updatedConta = await db.sql<Array<Conta>>`
    SELECT * FROM contas WHERE num_conta = ${numero}
  `;

  return updatedConta[0] ?? null;
}

export async function deleteByNumero(numero: number) {
  await db.sql`
    DELETE FROM contas
    WHERE num_conta = ${numero}
  `;
}