import { z } from "@/lib/zod";
import { addQueryParams } from "@/utils/schemas";

export const agenciaParams = addQueryParams(
  z.object({
    agencias_num_ag: z.string().trim().nullable().optional(),
  }),
);

export const agenciaLastXDaysParams = addQueryParams(
  z.object({
    agencias_num_ag: z.string().trim().nullable().optional(),
    last_x_days: z.string().trim().nullable().optional(),
  }),
);
