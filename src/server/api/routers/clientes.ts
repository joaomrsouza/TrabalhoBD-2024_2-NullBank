import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { omit } from "lodash";
import { accessProcedure, createTRPCRouter } from "../trpc";

export const clientesRouter = createTRPCRouter({
  upsert: accessProcedure(["dba"])
    .input(schemas.cliente.form)
    .mutation(async ({ input }) => {
      if (input.create) {
        const data = schemas.cliente.create.parse(input);
        return await db.queries.clientes.insert(data);
      }

      const data = schemas.cliente.update.parse(omit(input, ["cpf"]));

      return await db.queries.clientes.updateByCPF(input.cpf!, data);
    }),

  delete: accessProcedure(["dba"])
    .input(schemas.cliente.remove)
    .mutation(async ({ input }) => {
      return await db.queries.clientes.deleteByCPF(input.cpf);
    }),
});
