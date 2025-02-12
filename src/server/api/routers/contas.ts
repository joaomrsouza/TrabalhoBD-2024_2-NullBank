import { z } from "@/lib/zod";
import { db } from "@/server/database";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const contasRouter = createTRPCRouter({
  getContasClienteBasic: publicProcedure
    .input(z.object({ cpf: z.string() }))
    .query(async ({ input }) => db.queries.contas.getByClienteBasic(input.cpf)),
});
