import { z } from "@/lib/zod";
import { addQueryParams } from "@/server/utils/schemas";

export const form = z.object({
    cpf: z.string().trim().length(11, "CPF deve conter 11 caracteres"),

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

    rg_uf: z.string().trim().length(2, "A UF do RG deve ser um código de estado (Ex: 'CE', SP)")
})

export const create = form.strict();

const nonStrictUpdate = form.omit({ cpf: true });

export const update = nonStrictUpdate.strict();

export const prune = nonStrictUpdate.extend({
  data_nasc: z.date(),
}).transform(data =>({
  ...data,
  data_nasc: data.data_nasc.toISOString().split("T")[0]
}));

export const remove = z.object({ cpf: z.string() });

export const searchParams = addQueryParams(
  z.object({
    cpf: z.string().trim().nullable().optional(),
    nome: z.string().trim().nullable().optional(),
  }),
);