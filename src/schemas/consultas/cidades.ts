import { z } from "@/lib/zod";
import { addQueryParams } from "@/utils/schemas";

export const cidadesParams = addQueryParams(
  z.object({
    cidade: z.string().trim().nullable().optional(),
  }),
);
