import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { omit } from "lodash";
import { accessProcedure, createTRPCRouter } from "../trpc";

export const dependentesRouter = createTRPCRouter({
  upsert: accessProcedure(["dba"])
    .input(schemas.dependente.form)
    .mutation(async ({ input }) => {
      if (!input.nome_dependente) {
        const data = schemas.dependente.create.parse(input);
        return await db.queries.dependentes.insert(data); // TODO: Ajustar tipagem disso
      }

      const data = schemas.dependente.update.parse(
        omit(input, ["nome_dependente"]),
      );

      return await db.queries.dependentes.updateByNomeDependente(
        input.nome_dependente,
        data,
      ); // TODO: Ajustar update para receber matricula do funcionario
    }),

  delete: accessProcedure(["dba"])
    .input(schemas.dependente.remove)
    .mutation(async ({ input }) => {
      return await db.queries.dependentes.deleteByNomeDependente(input.nome_dependente);
    }),
});
