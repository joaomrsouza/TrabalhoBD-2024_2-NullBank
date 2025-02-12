import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { omit } from "lodash";
import { accessProcedure, createTRPCRouter } from "../trpc";

export const agenciasRouter = createTRPCRouter({
  upsert: accessProcedure(["dba"])
    .input(schemas.agencia.form)
    .mutation(async ({ input }) => {
      if (!input.num_ag) {
        const data = schemas.agencia.create.parse(input);
        return await db.queries.agencias.insert(data);
      }

      const data = schemas.agencia.update.parse(omit(input, ["num_ag"]));

      return await db.queries.agencias.updateByNumero(input.num_ag, data);
    }),

  delete: accessProcedure(["dba"])
    .input(schemas.agencia.remove)
    .mutation(async ({ input }) => {
      return await db.queries.agencias.deleteByNumero(input.num_ag);
    }),
});
