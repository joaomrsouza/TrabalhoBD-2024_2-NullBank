import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { omit } from "lodash";
import { accessProcedure, createTRPCRouter } from "../trpc";

export const transacoesRouter = createTRPCRouter({
  upsert: accessProcedure(["dba"])
    .input(schemas.transacao.form)
    .mutation(async ({ input }) => {
      if (!input.num_transacao) {
        const data = schemas.transacao.create.parse(input);
        return await db.queries.transacoes.insert(data);
      }

      const data = schemas.transacao.update.parse(omit(input, ["num_transacao"]));

      return await db.queries.transacoes.updateByNumero(
        input.num_transacao,
        data,
      );
    }),

  delete: accessProcedure(["dba"])
    .input(schemas.transacao.remove)
    .mutation(async ({ input }) => {
      return await db.queries.transacoes.deleteByNumero(input.num_transacao);
    }),
});
