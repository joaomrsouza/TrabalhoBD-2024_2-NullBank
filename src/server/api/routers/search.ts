import { z } from "@/lib/zod";
import { accessProcedure, createTRPCRouter } from "../trpc";

export const ObjectsSearch = ["agencia", "funcionario"] as const;
export type ObjectSearch = (typeof ObjectsSearch)[number];

export const searchRouter = createTRPCRouter({
  object: accessProcedure(["dba"])
    .input(
      z.object({
        object: z.enum(ObjectsSearch),
        search: z.string().trim().toLowerCase(),
      }),
    )
    .query(async ({ input }) => {
      // TODO: fazer a query devida
      return [
        {
          label: "Label teste",
          value: "Valor teste",
        },
      ];
    }),
});
