import { z } from "@/lib/zod";
import { CargosUser } from "@/server/auth/config";
import { Permission } from "@/server/services/permission";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  temPermissao: protectedProcedure
    .input(
      z.object({ cargo: z.enum(CargosUser).or(z.array(z.enum(CargosUser))) }),
    )
    .query(async ({ ctx, input }) => ({
      temPermissao: Permission.temPermissaoDeAcesso(
        input.cargo,
        ctx.session.user,
      ),
    })),
});
