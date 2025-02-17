import { schemas } from "@/schemas";
import { db } from "@/server/database";
import { omit } from "lodash";
import { accessProcedure, createTRPCRouter } from "../trpc";

export const funcionariosRouter = createTRPCRouter({
  upsert: accessProcedure(["dba"])
    .input(schemas.funcionario.form)
    .mutation(async ({ input }) => {
      if (!input.matricula) {
        const data = schemas.funcionario.create.parse(input);
        return await db.queries.funcionarios.insert(data); // TODO: Ajustar obrigatoriedade da senha
      }

      const data = schemas.funcionario.update.parse(omit(input, ["matricula"]));

      return await db.queries.funcionarios.updateByMatricula(
        input.matricula,
        data,
      );
    }),

  delete: accessProcedure(["dba"])
    .input(schemas.funcionario.remove)
    .mutation(async ({ input }) => {
      return await db.queries.funcionarios.deleteByMatricula(input.matricula);
    }),
});
