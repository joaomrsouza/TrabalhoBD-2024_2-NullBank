import { z } from "@/lib/zod";
import { Cargos, Generos } from "@/server/database/queries/funcionarios";
import { addQueryParams } from "@/server/utils/schemas";

export const form = z.object({
  agencias_num_ag: z.number().positive("O número da agência é obrigatório"),

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

export const create = form.strict();

const nonStrictUpdate = form.omit({ matricula: true });

export const update = nonStrictUpdate.strict();

export const prune = nonStrictUpdate
  .extend({
    data_nasc: z.date(),
  })
  .transform(data => ({
    ...data,
    data_nasc: data.data_nasc.toISOString().split("T")[0],
  }));

export const remove = z.object({ matricula: z.number() });

export const searchParams = addQueryParams(
  z.object({
    matricula: z.string().trim().nullable().optional(),
    nome: z.string().trim().nullable().optional(),
  }),
);
