import { z } from "@/lib/zod";
import { db } from "@/server/database";
import { type ObjectSearch, ObjectsSearch } from "@/utils/enums";
import { accessProcedure, createTRPCRouter } from "../trpc";

export const searchRouter = createTRPCRouter({
  object: accessProcedure(["dba"])
    .input(
      z.object({
        object: z.enum(ObjectsSearch),
        search: z.string().trim().toLowerCase(),
      }),
    )
    .query(async ({ input }) => {
      const resolvers: Record<
        ObjectSearch,
        () => Promise<Array<{ label: string; value: string }>>
      > = {
        agencia: async () =>
          (await db.queries.agencias.list(input.search)).map(a => ({
            label: a.nome_ag,
            value: a.num_ag.toString(),
          })),
        funcionario: async () => {
          // TODO: Colocar query aqui
          return [
            {
              label: "Funcionário teste",
              value: "Valor teste",
            },
          ];
        },
      };

      return await resolvers[input.object]();
    }),
});
