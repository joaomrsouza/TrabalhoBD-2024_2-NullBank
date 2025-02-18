import { type z } from "@/lib/zod";
import { type schemas } from "@/schemas";
import { type CountResponse, type OpResponse } from ".";
import { db } from "..";

export type Cliente = {
  cpf: string;
  data_nasc: Date;
  end_bairro: string;
  end_cep: string;
  end_cidade: string;
  end_estado: string;
  end_logradouro: string;
  end_numero: number;
  end_tipo: string;
  nome: string;
  rg_num: string;
  rg_orgao_emissor: string;
  rg_uf: string;
};

export type ClienteUpsert = {
  data_nasc: string;
} & Omit<Cliente, "data_nasc">;

type FilteredPageParams = z.infer<typeof schemas.cliente.searchParams>;

export async function getFilteredPage(params: FilteredPageParams): Promise<{
  clientes: Array<Cliente>;
  count: number;
}> {
  const { cpf, nome, skip, take } = params;

  const searchNome = Number(!nome);
  const searchCPF = Number(!cpf);

  const [clientes, countQuery] = await Promise.all([
    db.sql<Array<Cliente>>`
      SELECT * FROM clientes
      WHERE
        (nome LIKE CONCAT('%', ${nome ?? ""}, '%') OR ${searchNome} = 1)
        AND
        (cpf LIKE CONCAT('%', ${cpf ?? ""}, '%') OR ${searchCPF} = 1)
      ORDER BY nome ASC
      LIMIT ${String(skip)}, ${String(take)}
    `,

    db.sql<CountResponse>`
      SELECT COUNT(*) AS count FROM clientes
      WHERE
        (nome LIKE CONCAT('%', ${nome ?? ""}, '%') OR ${searchNome} = 1)
        AND
        (cpf LIKE CONCAT('%', ${cpf ?? ""}, '%') OR ${searchCPF} = 1)
    `,
  ]);

  return {
    clientes,
    count: countQuery[0].count,
  };
}

export async function getByCpf(cpf: string) {
  const result = await db.sql<Array<Cliente>>`
    SELECT * FROM clientes WHERE cpf = ${cpf}
  `;

  return result[0] ?? null;
}

export async function getNomeByCpf(cpf: string) {
  const result = await db.sql<Array<Pick<Cliente, "nome">>>`
    SELECT nome FROM clientes WHERE cpf = ${cpf}
  `;

  return result[0] ?? null;
}

export async function insert(data: ClienteUpsert) {
  const result = await db.sql<OpResponse>`
    INSERT INTO clientes
      (cpf, nome, data_nasc, rg_num, rg_orgao_emissor, rg_uf, end_tipo, end_logradouro, end_numero, end_bairro, end_cep, end_cidade, end_estado)
    VALUES
      (${data.cpf}, ${data.nome}, ${data.data_nasc}, ${data.rg_num}, ${data.rg_orgao_emissor}, ${data.rg_uf}, ${data.end_tipo}, ${data.end_logradouro}, ${data.end_numero}, ${data.end_bairro}, ${data.end_cep}, ${data.end_cidade}, ${data.end_estado})
  `;

  const newCliente = await db.sql<Array<Cliente>>`
    SELECT * FROM clientes WHERE cpf = ${result.insertId}
  `;

  return newCliente[0] ?? null;
}

export async function updateByCPF(
  cpf: string,
  data: Omit<ClienteUpsert, "cpf">,
) {
  await db.sql`
    UPDATE clientes SET
      nome = ${data.nome},
      data_nasc = ${data.data_nasc},
      rg_num = ${data.rg_num},
      rg_orgao_emissor = ${data.rg_orgao_emissor},
      rg_uf = ${data.rg_uf},
      end_tipo = ${data.end_tipo},
      end_logradouro = ${data.end_logradouro},
      end_numero = ${data.end_numero},
      end_bairro = ${data.end_bairro},
      end_cep = ${data.end_cep},
      end_cidade = ${data.end_cidade},
      end_estado = ${data.end_estado}
    WHERE cpf = ${cpf}
  `;

  const updatedCliente = await db.sql<Array<Cliente>>`
    SELECT * FROM clientes WHERE cpf = ${cpf}
  `;

  return updatedCliente[0] ?? null;
}

export async function deleteByCPF(cpf: string) {
  await db.sql`
    DELETE FROM clientes
    WHERE cpf = ${cpf}
  `;
}
