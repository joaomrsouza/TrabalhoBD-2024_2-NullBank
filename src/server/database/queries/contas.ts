import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { AuthService } from "@/server/services/auth";
import { type TipoConta } from "@/utils/enums";
import { type CountResponse, type OpResponse } from ".";
import { db } from "..";
import { type ClientesHasContas } from "./clientes-has-contas";

export type Conta = {
  agencias_num_ag: number;
  funcionarios_matricula_gerente: number;
  num_conta: number;
  saldo: number;
  salt: string;
  senha: string;
  tipo: TipoConta;
};

export type ExtendedConta = Conta & {
  data_aniversario?: Date;
  limite_credito?: number;
  taxa_juros?: number;
};

export type ContaUpsert = Omit<Conta, "num_conta" | "saldo" | "salt"> & {
  clientes_cpf: Array<string>;
  data_aniversario: string;
  limite_credito: number;
  taxa_juros: number;
};

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
        (tipo = ${tipo ?? ""} OR ${searchTipo} = 1)
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) AS count FROM contas
      WHERE
        (num_conta = ${num_conta ?? ""} OR ${searchNumConta} = 1)
        AND
        (tipo = ${tipo ?? ""} OR ${searchTipo} = 1)
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
  const result = await db.sql<Array<ExtendedConta>>`
    SELECT *
    FROM contas c
      LEFT JOIN contas_corrente cc
        ON c.num_conta = cc.contas_num_conta
      LEFT JOIN contas_especial ce
        ON c.num_conta = ce.contas_num_conta
      LEFT JOIN contas_poupanca cp
        ON c.num_conta = cp.contas_num_conta
    WHERE num_conta = ${numero}
  `;

  return result[0] ?? null;
}

export async function insert(data: ContaUpsert) {
  const { hash: senha, salt } = await AuthService.hashPassword(data.senha);

  const result = await db.sql<OpResponse>`
    INSERT INTO contas
      (agencias_num_ag, funcionarios_matricula_gerente, salt, senha, tipo)
    VALUES
      (${data.agencias_num_ag}, ${data.funcionarios_matricula_gerente}, ${salt.toString("base64")}, ${senha.toString("base64")}, ${data.tipo})
  `;

  await Promise.all(
    data.clientes_cpf.map(
      cpf =>
        db.sql`
          INSERT INTO clientes_has_contas
            (contas_num_conta, clientes_cpf)
          VALUES
            (${result.insertId}, ${cpf})
        `,
    ),
  );

  if (data.tipo === "corrente")
    await db.sql`
      INSERT INTO contas_corrente
        (contas_num_conta, data_aniversario)
      VALUES
        (${result.insertId}, ${data.data_aniversario})
    `;

  if (data.tipo === "especial")
    await db.sql`
      INSERT INTO contas_especial
        (contas_num_conta, limite_credito)
      VALUES
        (${result.insertId}, ${data.limite_credito})
    `;

  if (data.tipo === "poupança")
    await db.sql`
      INSERT INTO contas_poupanca
        (contas_num_conta, taxa_juros)
      VALUES
        (${result.insertId}, ${data.taxa_juros})
    `;

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
        senha = ${senha.toString("base64")},
        salt = ${salt.toString("base64")},
        tipo = ${data.tipo}
      WHERE num_conta = ${numero}
    `;
  } else {
    await db.sql`
      UPDATE contas SET
        agencias_num_ag = ${data.agencias_num_ag},
        funcionarios_matricula_gerente = ${data.funcionarios_matricula_gerente},
        tipo = ${data.tipo}
      WHERE num_conta = ${numero}
    `;
  }

  await db.sql`
    DELETE FROM clientes_has_contas WHERE contas_num_conta = ${numero}
  `;

  await Promise.all(
    data.clientes_cpf.map(
      cpf =>
        db.sql`
          INSERT INTO clientes_has_contas
            (contas_num_conta, clientes_cpf)
          VALUES
            (${numero}, ${cpf})
        `,
    ),
  );

  await Promise.all([
    db.sql`
      DELETE FROM contas_corrente WHERE contas_num_conta = ${numero}
    `,
    db.sql`
      DELETE FROM contas_especial WHERE contas_num_conta = ${numero}
    `,
    db.sql`
      DELETE FROM contas_poupanca WHERE contas_num_conta = ${numero}
    `,
  ]);

  if (data.tipo === "corrente")
    await db.sql`
      INSERT INTO contas_corrente
        (contas_num_conta, data_aniversario)
      VALUES
        (${numero}, ${data.data_aniversario})
    `;

  if (data.tipo === "especial")
    await db.sql`
      INSERT INTO contas_especial
        (contas_num_conta, limite_credito)
      VALUES
        (${numero}, ${data.limite_credito})
    `;

  if (data.tipo === "poupança")
    await db.sql`
      INSERT INTO contas_poupanca
        (contas_num_conta, taxa_juros)
      VALUES
        (${numero}, ${data.taxa_juros})
    `;

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

export async function list(search: string) {
  const searchNumero = Number(!search);

  return db.sql<Array<Pick<Conta, "num_conta">>>`
    SELECT num_conta FROM contas
    WHERE
      num_conta = ${search ?? ""}
      OR
      ${searchNumero} = 1
  `;
}
