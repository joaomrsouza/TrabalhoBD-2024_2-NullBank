import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { agenciasRouter } from "./routers/agencias";
import { authRouter } from "./routers/auth";
import { clientesRouter } from "./routers/clientes";
import { contasRouter } from "./routers/contas";
import { dependentesRouter } from "./routers/dependentes";
import { funcionariosRouter } from "./routers/funcionarios";
import { searchRouter } from "./routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  agencias: agenciasRouter,
  auth: authRouter,
  clientes: clientesRouter,
  contas: contasRouter,
  dependentes: dependentesRouter,
  funcionarios: funcionariosRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
