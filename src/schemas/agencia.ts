import { z } from "@/lib/zod";
import { addQueryParams } from "@/utils/schemas";

export const form = z.object({
  cidade_ag: z.string().trim().min(1, "Cidade da agência é obrigatória"),

  nome_ag: z.string().trim().min(1, "Nome da agência é obrigatório"),

  num_ag: z.number().optional(),
});

export const create = form.strict();

const nonStrictUpdate = form.omit({ num_ag: true });

export const update = nonStrictUpdate.strict();

export const prune = nonStrictUpdate;

export const remove = z.object({ num_ag: z.number() });

export const searchParams = addQueryParams(
  z.object({
    cidade_ag: z.string().trim().nullable().optional(),
    nome_ag: z.string().trim().nullable().optional(),
  }),
);
