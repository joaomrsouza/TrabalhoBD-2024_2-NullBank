import { z } from "@/lib/zod";
import { addQueryParams } from "@/utils/schemas";

export const funcionariosParams = addQueryParams(
  z.object({
    agencias_num_ag: z.string().trim().nullable().optional(),
  }),
);
