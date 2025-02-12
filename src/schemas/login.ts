import { z } from "@/lib/zod";

export const form = z.object({
  conta: z.string().nullable(),
  login: z.string().trim().min(1),
  senha: z.string().min(1),
});
