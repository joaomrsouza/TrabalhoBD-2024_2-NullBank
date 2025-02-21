import { z } from "@/lib/zod";
import { TiposConta } from "@/utils/enums";
import { addQueryParams } from "@/utils/schemas";

export const form = z.object({
  agencias_num_ag: z
    .string()
    .trim()
    .min(1, "O número da agência é obrigatório"),

  funcionarios_matricula_gerente: z
    .string()
    .trim()
    .min(1, "A matrícula do gerente é obrigatório"),

  clientes_cpf: z
    .string()
    .trim()
    .min(1, "O CPF do cliente é obrigatório")
    .array()
    .max(2, "Uma conta pode ter no máximo dois clientes associados"),

  senha: z.string().trim().optional(),

  tipo: z.enum(TiposConta),

  num_conta: z.number().optional(),

  limite_credito: z.number().min(0, "O limite de crédito deve ser 0 ou maior."),

  data_aniversario: z
    .string()
    .date("A data de aniversário da conta deve ser aaaa-mm-dd")
    .or(z.literal("")),

  taxa_juros: z.number().min(0, "A taxa de juros deve ser 0 ou maior."),
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

export const update = nonStrictUpdate.strict().transform(d => ({
  ...d,
  agencias_num_ag: Number(d.agencias_num_ag),
  funcionarios_matricula_gerente: Number(d.funcionarios_matricula_gerente),
}));

export const prune = nonStrictUpdate
  .omit({ senha: true })
  .extend({
    agencias_num_ag: z.number(),
    data_aniversario: z.date().or(z.literal("")).optional(),
    funcionarios_matricula_gerente: z.number(),
  })
  .transform(data => ({
    ...data,
    agencias_num_ag: data.agencias_num_ag.toString(),
    data_aniversario:
      typeof data.data_aniversario === "string"
        ? ""
        : data.data_aniversario?.toISOString().split("T")[0],
    funcionarios_matricula_gerente: data.agencias_num_ag.toString(),
  }));

export const remove = z.object({ num_conta: z.number() });

export const searchParams = addQueryParams(
  z.object({
    num_conta: z.string().trim().nullable().optional(),
    tipo: z.string().trim().nullable().optional(),
  }),
);
