import { z } from "@/lib/zod";
import { addQueryParams } from "@/utils/schemas";

export const contaLastXDaysParams = addQueryParams(
  z.object({
    last_x_days: z.string().trim().nullable().optional(),
    num_conta: z.string().trim().nullable().optional(),
  }),
);
