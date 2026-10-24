# serverless (prototype)

A prototype of Dextinity on Cloudflare Workers, built along [DECISIONS-SERVERLESS.md](../../DECISIONS-SERVERLESS.md): Hono with REST and typed clients, Drizzle on D1 **or** PostgreSQL, the admin as a Vite single-page app on `@dextinity/admin`, Cloudflare Access for login, Dextinity's permission model and the Images binding for images. It starts with the DAM.

| Package                                            | `./server`                                                                                                                       | `./client`                                        |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [`@dextinity/serverless-core`](core)               | `provide`/`inject`, errors, `zValidator`, portable Drizzle (`portableColumns`, `Database`), R2, image transformer, Access, cache | `ApiProvider`, `QueryErrorHandler`                |
| [`@dextinity/serverless-permissions`](permissions) | Grants, roles, group roles; `requirePermission`, `assertCan`, `scopeFilter`; `GET /me`                                           | `CurrentUserProvider`, `useCan`, `useCurrentUser` |
| [`@dextinity/serverless-dam`](dam)                 | Schema, services and routes of the DAM                                                                                           | `DamApiProvider`, `DamPage`                       |

`@dextinity/serverless-core/vite` contains `dextinityDevServer()`, the local development services: an emulator of Cloudflare Access and an image transformer with sharp.

The demo is [`demo/serverless`](../../demo/serverless): one Vite project and one Worker, which serves the admin as static assets and the API at `/api`. It follows the layout of Cloudflare's React template (`create-cloudflare`), with `api/` instead of `worker/`:

- `src/`: the admin, `api/`: the API (the Worker's entry point), `scripts/`: Node.js scripts
- one tsconfig each (`tsconfig.app.json`, `tsconfig.api.json`, `tsconfig.node.json`), referenced from `tsconfig.json` for the editor and `tsc -b`
- ESLint forbids imports between `src/` and `api/`, values from `@dextinity/*/server` in the admin (types are fine) and `@dextinity/*/client` in the API

## Running the demo

Requires the builds of `@dextinity/admin` and `@dextinity/admin-icons`.

```bash
# On D1 (local SQLite of wrangler), no Docker needed
pnpm --filter dextinity-demo-serverless db:migrate:d1
pnpm --filter dextinity-demo-serverless db:seed:d1
pnpm exec dev-pm start @demo-serverless

# On PostgreSQL (the container of docker-compose.yml, database main_serverless) via Hyperdrive
pnpm exec dev-pm start demo-docker
pnpm --filter dextinity-demo-serverless db:migrate:postgresql
pnpm --filter dextinity-demo-serverless db:seed:postgresql
pnpm exec dev-pm start @demo-serverless-postgresql

# Both on http://localhost:8010. Exercises the API through the typed clients:
pnpm --filter dextinity-demo-serverless smoke-test
```

The Access emulator shows a login page with three users: Admin (group `admins`, all permissions by rule), Editor (group `editors`, the DAM of `main` through a group role) and Guest (the DAM of `secondary` through a stored grant).

`pnpm --filter dextinity-demo-serverless build` builds the Worker and the admin for production; the emulator and the dev image transformer aren't part of it.
To deploy, create the D1 database (or the Hyperdrive config), the R2 bucket and an Access application, put their IDs into `wrangler.jsonc`, set the secret (`wrangler secret put DAM_SECRET`), apply the migrations (`wrangler d1 migrations apply DB --remote`) and run `deploy`. The public file and image URLs (`/api/dam/files/<hash>/…`, `/api/dam/images/<hash>/…`) need a bypass policy in Access.

## Wiring modules into an app

```ts
const permissions = createPermissionsModule({ dialect, contentScopes, rules: permissionRules });
const dam = createDamModule({ dialect, damConfig: config.dam, Scope: DamScope });

new Hono<{ Bindings: Bindings }>()
    .basePath("/api")
    .onError(dextinityErrorHandler)
    .use(provideDatabase(dialect)) // `database`: createD1Database(env.DB) or createPostgresqlDatabase(drizzle(postgres(env.HYPERDRIVE…)))
    .use(provide("blobStorage", (c) => new R2BlobStorage(c.env.DAM_FILES)))
    .use(
        provide("imageTransformer", (c) =>
            import.meta.env.DEV ? new DevServerImageTransformer(origin) : new CloudflareImagesTransformer(c.env.IMAGES),
        ),
    )
    .use(cloudflareAccess((c) => (import.meta.env.DEV ? devAccessConfig(c) : config.access))) // `identity`
    .use(permissions.provider) // `currentUser` with its grants
    .route("/", permissions.routes)
    .route("/dam", dam.routes);
```

In the admin, each module has its own typed client below the `ApiProvider`'s URL (`hc<DamRoutes<…>>("/api/dam")`), so typechecking stays fast and the admin never imports Worker code.

## Writing code for D1 and PostgreSQL

Tables are defined once with `portableColumns(dialect)`, which returns SQLite or PostgreSQL column builders. Both are typed as SQLite tables, and `database.drizzle` is typed as a SQLite database, so services are written once. drizzle-kit generates the migrations per dialect from the same definition (`pnpm --filter dextinity-demo-serverless db:generate`).

Rules, because the types don't catch everything:

- Build queries with `select`, `insert`, `update`, `delete` and `$count` and await them. `.get()`, `.all()`, `.run()` and `.values()` only exist on SQLite.
- No interactive transactions (D1 has none): generate IDs with `crypto.randomUUID()` and write several rows with `database.batch((db) => [...])`, a batch on D1 and a transaction on PostgreSQL.
- Portable SQL only: `containsIgnoringCase()` instead of `ILIKE`, recursive queries (`database.rows(sql\`with recursive …\`)`) instead of arrays, window functions are fine. Quote identifiers with double quotes.
- The smoke test runs against both databases, run it on both after changing queries.

## What the prototype covers

- DAM: files (list, search, get with DAM path and duplicates, update, move, archive, delete), upload and replace, file delivery (hashed public URLs, preview URLs, downloads, ranges), images (focus and smart crops, allowed sizes and aspect ratios, AVIF/WebP negotiation, Cache API), folders (recursive ancestors, move, delete, zip), DAM items, dominant color on upload
- Permissions: grants with validity, roles, roles per identity provider group, rules in project code, content scopes with `*` wildcards, `scopeFilter` on the DAM lists, `GET /me`, `useCan` in the admin
- Access: JWT verification against the team's keys with `jose`, groups from the identity endpoint (cached per isolate), service tokens, the emulator for local development

Left out for now: impersonation and the admin UI for grants, users stored on first request, DAM dependencies, warnings and media alternatives, SVG validation (DOMPurify needs a DOM), blocks, background jobs, migrating existing projects (the schema no longer maps to the MikroORM tables: no `mpath`, column names without the embeddable prefixes).
