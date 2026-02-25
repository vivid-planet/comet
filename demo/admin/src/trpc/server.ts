import { createHTTPServer } from "@trpc/server/adapters/standalone";

import { appRouter } from "./router";

const port = Number(process.env.ADMIN_TRPC_PORT ?? 3002);

const server = createHTTPServer({
    router: appRouter,
});

server.listen(port);
console.log(`tRPC server listening on http://localhost:${port}`);
