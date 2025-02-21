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
            label: `${a.nome_ag} (${a.num_ag})`,
            value: a.num_ag.toString(),
          })),
        cliente: async () =>
          (await db.queries.clientes.list(input.search)).map(c => ({
            label: `${c.nome} (${c.cpf})`,
            value: c.cpf,
          })),
        gerente: async () =>
          (await db.queries.funcionarios.listGerente(input.search)).map(g => ({
            label: `${g.nome} (${g.matricula})`,
            value: g.matricula.toString(),
          })),
      };

      return await resolvers[input.object]();
    }),
});
