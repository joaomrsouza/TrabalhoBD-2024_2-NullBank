import { z } from "@/lib/zod";
import { addQueryParams } from "@/server/utils/schemas";

export const form = z.object({
  data_nasc: z.string().date("A data de nascimento deve ser aaaa-mm-dd"),

  funcionario_matricula: z.number().positive("O funcionário é obrigatório"),

  nome_dependente: z
    .string()
    .trim()
    .length(11, "Nome do Dependente é obrigatório"),

  parentesco: z.string().trim().min(1, "Parentesco é obrigatório"),
});

export const create = form.strict();

const nonStrictUpdate = form.omit({ nome_dependente: true });

export const update = nonStrictUpdate.strict();

export const prune = nonStrictUpdate
  .extend({
    data_nasc: z.date(),
  })
  .transform(data => ({
    ...data,
    data_nasc: data.data_nasc.toISOString().split("T")[0],
  }));

export const remove = z.object({ nome_dependente: z.string() });

export const searchParams = addQueryParams(
  z.object({
    nome_dependente: z.string().trim().nullable().optional(),
  }),
);
