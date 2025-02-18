import { z } from "@/lib/zod";
import { Cargos, Generos } from "@/utils/enums";
import { addQueryParams } from "@/utils/schemas";

export const form = z.object({
  agencias_num_ag: z
    .string()
    .trim()
    .min(1, "O número da agência é obrigatório"),

  nome: z.string().trim().min(1, "O nome é obrigatório"),

  data_nasc: z.string().date("A data de nascimento deve ser aaaa-mm-dd"),

  genero: z.enum(Generos),

  endereco: z.string().trim().min(1, "Endereço é obrigatório"),

  cidade: z.string().trim().min(1, "Cidade é obrigatório"),

  cargo: z.enum(Cargos),

  salario: z.number().positive("Salário é obrigatório"),

  senha: z.string().trim().optional(),

  matricula: z.number().optional(),
});

export const create = form
  .extend({
    senha: z.string().trim().min(1, "Senha é obrigatória"),
  })
  .strict()
  .transform(d => ({ ...d, agencias_num_ag: Number(d.agencias_num_ag) }));

const nonStrictUpdate = form.omit({ matricula: true });

export const update = nonStrictUpdate
  .strict()
  .transform(d => ({ ...d, agencias_num_ag: Number(d.agencias_num_ag) }));

export const prune = nonStrictUpdate
  .omit({ senha: true })
  .extend({
    agencias_num_ag: z.number(),
    data_nasc: z.date(),
  })
  .transform(data => ({
    ...data,
    agencias_num_ag: data.agencias_num_ag.toString(),
    data_nasc: data.data_nasc.toISOString().split("T")[0],
  }));

export const remove = z.object({ matricula: z.number() });

export const searchParams = addQueryParams(
  z.object({
    matricula: z.string().trim().nullable().optional(),
    nome: z.string().trim().nullable().optional(),
  }),
);
