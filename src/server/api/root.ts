import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { agenciasRouter } from "./routers/agencias";
import { clientesRouter } from "./routers/clientes";
import { authRouter } from "./routers/auth";
import { contasRouter } from "./routers/contas";
import { searchRouter } from "./routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  agencias: agenciasRouter,
  clientes: clientesRouter,
  auth: authRouter,
  contas: contasRouter,
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
