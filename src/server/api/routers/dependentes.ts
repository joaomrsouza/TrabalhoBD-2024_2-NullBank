import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { omit } from "lodash";
import { accessProcedure, createTRPCRouter } from "../trpc";

export const dependentesRouter = createTRPCRouter({
  upsert: accessProcedure(["dba"])
    .input(schemas.dependente.form)
    .mutation(async ({ input }) => {
      if (input.create) {
        const data = schemas.dependente.create.parse(
          omit(input, ["matricula"]),
        );
        return await db.queries.dependentes.insert(input.matricula, data);
      }

      const data = schemas.dependente.update.parse(
        omit(input, ["matricula", "nome_dependente"]),
      );

      return await db.queries.dependentes.updateByNomeDependente(
        input.matricula,
        input.nome_dependente,
        data,
      );
    }),

  delete: accessProcedure(["dba"])
    .input(schemas.dependente.remove)
    .mutation(async ({ input }) => {
      return await db.queries.dependentes.deleteByNomeDependente(
        input.matricula,
        input.nome_dependente,
      );
    }),
});
