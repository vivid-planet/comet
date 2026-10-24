import { hc } from "hono/client";

import type { AppType } from "./app.ts";

export type { AppType };

export type ApiClient = ReturnType<typeof hc<AppType>>;

/** A typed client for the API. Import it in the admin or site, the request and response types are inferred from the routes. */
export const createApiClient = (...args: Parameters<typeof hc>): ApiClient => hc<AppType>(...args);
