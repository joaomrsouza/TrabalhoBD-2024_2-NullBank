import { z } from "@/lib/zod";
import { addQueryParams } from "@/utils/schemas";

export const clienteParams = addQueryParams(
  z.object({
    clientes_cpf: z.string().trim().nullable().optional(),
  }),
);

export const clienteLastXDaysParams = addQueryParams(
  z.object({
    clientes_cpf: z.string().trim().nullable().optional(),
    last_x_days: z.string().trim().nullable().optional(),
  }),
);
