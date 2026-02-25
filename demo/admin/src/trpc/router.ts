import type { inferRouterOutputs } from "@trpc/server";

import { t } from "./base";
import { routes } from "./_routes";

export const appRouter = t.router({
    hello: t.procedure.query(() => {
        return { message: "Hello from tRPC!" };
    }),
    ...routes,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
