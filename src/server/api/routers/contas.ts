import { z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { omit } from "lodash";
import { accessProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const contasRouter = createTRPCRouter({
  getContasClienteBasic: publicProcedure
    .input(z.object({ cpf: z.string() }))
    .query(async ({ input }) => db.queries.contas.getByClienteBasic(input.cpf)),

  upsert: accessProcedure(["dba"])
    .input(schemas.conta.form)
    .mutation(async ({ input }) => {
      if (!input.num_conta) {
        const data = schemas.conta.create.parse(input);
        return await db.queries.contas.insert(data);
      }

      const data = schemas.conta.update.parse(omit(input, ["num_conta"]));

      return await db.queries.contas.updateByNumero(
        input.num_conta,
        data,
      );
    }),

  delete: accessProcedure(["dba"])
    .input(schemas.conta.remove)
    .mutation(async ({ input }) => {
      return await db.queries.contas.deleteByNumero(input.num_conta);
    }),
});
