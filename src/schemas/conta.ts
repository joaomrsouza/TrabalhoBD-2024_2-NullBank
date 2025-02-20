import { z } from "@/lib/zod";
import { TiposConta } from "@/utils/enums";
import { addQueryParams } from "@/utils/schemas";

export const form = z.object({
  agencias_num_ag: z
    .string()
    .trim()
    .min(1, "O número da agência é obrigatório"),

  funcionarios_matricula_gerente: z.string().trim().min(1, "A matrícula do gerente é obrigatório"),

  senha: z.string().trim().optional(),

  tipo: z.enum(TiposConta),

  num_conta: z.number().optional(),
});

export const create = form
  .extend({
    senha: z.string().trim().min(1, "Senha é obrigatória"),
  })
  .strict()
  .transform(d => ({
    ...d,
    agencias_num_ag: Number(d.agencias_num_ag),
    funcionarios_matricula_gerente: Number(d.funcionarios_matricula_gerente),
  }));

const nonStrictUpdate = form.omit({ num_conta: true });

export const update = nonStrictUpdate
  .strict()
  .transform(d => ({
    ...d,
    agencias_num_ag: Number(d.agencias_num_ag),
    funcionarios_matricula_gerente: Number(d.funcionarios_matricula_gerente),
  }));

export const prune = nonStrictUpdate
  .omit({ senha: true })
  .extend({
    agencias_num_ag: z.number(),
    data_nasc: z.date(),
    funcionarios_matricula_gerente: z.number(),
  })
  .transform(data => ({
    ...data,
    agencias_num_ag: data.agencias_num_ag.toString(),
    data_nasc: data.data_nasc.toISOString().split("T")[0],
    funcionarios_matricula_gerente: data.agencias_num_ag.toString(),
  }));

export const remove = z.object({ num_conta: z.number() });

export const searchParams = addQueryParams(
  z.object({
    num_conta: z.string().trim().nullable().optional(),
    tipo: z.string().trim().nullable().optional(),
  }),
);
