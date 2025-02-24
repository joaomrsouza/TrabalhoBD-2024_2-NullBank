import { z } from "@/lib/zod";
import { addQueryParams } from "@/utils/schemas";

export const form = z.object({
  cpf: z.string().trim().length(11, "CPF deve conter 11 caracteres").optional(),

  create: z.boolean().optional(),

  data_nasc: z.string().date("A data de nascimento deve ser aaaa-mm-dd"),

  end_bairro: z.string().trim().min(1, "Bairro é obrigatório"),

  end_cep: z.string().trim().min(1, "Cep é obrigatório"),

  end_cidade: z.string().trim().min(1, "Cidade é obrigatório"),

  end_estado: z.string().trim().min(1, "Estado é obrigatório"),

  end_logradouro: z.string().trim().min(1, "Logradouro é obrigatório"),

  end_numero: z.number().positive(),

  end_tipo: z.string().trim().min(1, "O tipo de endereço é obrigatório"),

  nome: z.string().trim().min(1, "O nome é obrigatório"),

  rg_num: z.string().trim().min(1, "O número do RG é obrigatório"),

  rg_orgao_emissor: z.string().trim().min(1, "O orgão emissor é obrigatório"),

  rg_uf: z
    .string()
    .trim()
    .length(2, "A UF do RG deve ser um código de estado (Ex: 'CE', SP)"),

  emails: z
    .array(
      z.object({
        email: z.string().email().nullable(),

        tipo: z.string().trim().nullable(),
      }),
    )
    .transform(data => data.filter(d => (d.email?.length ?? 0) > 1)),

  telefones: z
    .array(
      z.object({
        telefone: z
          .string()
          .regex(
            /\(\d{2}\) \d{5}\-\d{4}/,
            "O telefone deve estar no formato (00) 00000-0000.",
          )
          .or(z.literal(""))
          .nullable(),

        tipo: z.string().trim().nullable(),
      }),
    )
    .transform(data => data.filter(d => (d.telefone?.length ?? 0) > 1)),
});

export const create = form
  .extend({
    cpf: z.string().trim().length(11, "CPF deve conter 11 caracteres"),
  })
  .strict();

const nonStrictUpdate = form.omit({ cpf: true });

export const update = nonStrictUpdate.strict();

export const prune = nonStrictUpdate
  .extend({
    data_nasc: z.date(),
  })
  .transform(data => ({
    ...data,
    data_nasc: data.data_nasc.toISOString().split("T")[0],
    emails: data.emails.length ? data.emails : [{ email: "", tipo: "" }],
    telefones: data.telefones.length
      ? data.telefones
      : [{ telefone: "", tipo: "" }],
  }));

export const remove = z.object({ cpf: z.string() });

export const searchParams = addQueryParams(
  z.object({
    cpf: z.string().trim().nullable().optional(),
    nome: z.string().trim().nullable().optional(),
  }),
);
