import { db } from "..";

export type Cliente = {
  cpf: string;
  data_nasc: string;
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

export async function getByCpf(cpf: string) {
  const result = await db.sql<Array<Cliente>>`
    SELECT * FROM clientes WHERE cpf = ${cpf}
  `;

  return result[0] ?? null;
}
