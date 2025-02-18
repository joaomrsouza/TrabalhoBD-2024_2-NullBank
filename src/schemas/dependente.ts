import { z } from "@/lib/zod";
import { Parentescos } from "@/utils/enums";
import { addQueryParams } from "@/utils/schemas";

export const form = z.object({
  data_nasc: z.string().date("A data de nascimento deve ser aaaa-mm-dd"),

  nome_dependente: z.string().trim().min(1, "Nome do Dependente é obrigatório"),

  parentesco: z.enum(Parentescos),

  create: z.boolean().optional(),

  matricula: z.number(),
});

export const create = form.omit({ matricula: true }).strict();

const nonStrictUpdate = form.omit({ matricula: true, nome_dependente: true });

export const update = nonStrictUpdate.strict();

export const prune = nonStrictUpdate
  .extend({
    data_nasc: z.date(),
  })
  .transform(data => ({
    ...data,
    data_nasc: data.data_nasc.toISOString().split("T")[0],
  }));

export const remove = z.object({
  matricula: z.number(),
  nome_dependente: z.string(),
});

export const searchParams = addQueryParams(
  z.object({
    nome_dependente: z.string().trim().nullable().optional(),
  }),
);
