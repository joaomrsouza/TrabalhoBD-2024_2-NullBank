import { z } from "@/lib/zod";
import { TiposTransacao } from "@/utils/enums";
import { addQueryParams } from "@/utils/schemas";

export const form = z.object({
  contas_num_conta_origem: z
    .string()
    .trim()
    .min(1, "O número da conta de origem é obrigatório"),

  contas_num_conta_destino: z.string().trim(),

  valor: z
    .string()
    .trim()
    .min(1, "O valor é obrigatório"),

  tipo: z.enum(TiposTransacao),

  num_transacao: z.number().optional(),
});

export const create = form
  .strict()
  .transform(d => ({
    ...d,
    contas_num_conta_destino: Number(d.contas_num_conta_destino),
    contas_num_conta_origem: Number(d.contas_num_conta_origem),
    valor: Number(d.valor),
  }));

const nonStrictUpdate = form.omit({ num_transacao: true });

export const update = nonStrictUpdate
  .strict()
  .transform(d => ({
    ...d,
    contas_num_conta_destino: Number(d.contas_num_conta_destino),
    contas_num_conta_origem: Number(d.contas_num_conta_origem),
    valor: Number(d.valor),
  }));

export const prune = nonStrictUpdate
  .extend({
    contas_num_conta_destino: z.number(),
    contas_num_conta_origem: z.number(),
    valor: z.number(),
  })
  .transform(data => ({
    ...data,
    contas_num_conta_destino: data.contas_num_conta_destino.toString(),
    contas_num_conta_origem: data.contas_num_conta_origem.toString(),
    valor: data.valor.toString(),
  }));

export const remove = z.object({ num_transacao: z.number() });

export const searchParams = addQueryParams(
  z.object({
    num_transacao: z.string().trim().nullable().optional(),
    tipo: z.string().trim().nullable().optional(),
  }),
);
