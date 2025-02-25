import { z } from "@/lib/zod";
import { addQueryParams } from "@/utils/schemas";

export const gerenteParams = addQueryParams(
  z.object({
    funcionarios_matricula_gerente: z.string().trim().nullable().optional(),
  }),
);
