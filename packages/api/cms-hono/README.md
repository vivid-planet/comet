# @dextinity/cms-hono (prototype)

A prototype of the Dextinity CMS API on [Hono](https://hono.dev) instead of NestJS, starting with the DAM. It runs on Node.js and on Cloudflare Workers.
The demo application is in [`demo/api-hono`](../../../demo/api-hono).

The prototype works on the same database as `@dextinity/cms-api` (the Drizzle schema maps to the tables of the MikroORM migrations) and generates the same file and image URLs (same HMAC signing), so both APIs can run side by side.

## Running the prototype

Requires the Postgres and imgproxy containers (`pnpm exec dev-pm start demo-docker`) and the DAM tables (`pnpm --filter dextinity-demo-api db:migrate`).

```bash
pnpm --filter @dextinity/cms-hono build

# Node.js, files in demo/uploads (shared with the NestJS demo and imgproxy)
pnpm --filter dextinity-demo-api-hono dev

# Cloudflare Workers runtime (workerd) with a local R2 bucket and Hyperdrive pointing to the local Postgres
pnpm --filter dextinity-demo-api-hono dev:worker

# Exercise the DAM through the typed client
pnpm --filter dextinity-demo-api-hono smoke-test                         # Node.js
pnpm --filter dextinity-demo-api-hono smoke-test http://localhost:8787   # Worker
```

Requests are authenticated with `Authorization: Bearer $API_HONO_TOKEN` (see `.env`).

To deploy: create the R2 bucket and the Hyperdrive config, put their IDs into `wrangler.jsonc`, set the secrets (`wrangler secret put DAM_SECRET` etc.), and run `pnpm --filter dextinity-demo-api-hono deploy`.
imgproxy keeps running as a separate service. It loads images either from R2 through its S3-compatible API (`R2_IMGPROXY_SOURCE_URL_PREFIX=s3://<bucket>/` plus the S3 settings of imgproxy) or from the public DAM URLs of the Worker (`API_HONO_PUBLIC_URL`).

## Patterns: from NestJS to Hono

| NestJS                                      | Hono prototype                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `DamModule.register(options)`               | `createDamModule(options)` returns `{ schema, provider, routes, createServices }`                                                |
| Providers, `@Injectable()`, constructor DI  | Plain classes that get their dependencies passed in. `createDamServices()` wires them in a container                             |
| `forwardRef()` for circular dependencies    | Services reference each other through the container object (`this.services.files`)                                               |
| Module `imports` (e.g. `BlobStorageModule`) | Dependencies in the request context, registered with `app.use(provide("blobStorage", …))` and read with `inject()`               |
| Module `exports`                            | The module's provider middleware sets `c.var.dam` (`files`, `folders`, `items`, `images`) for routes and other modules           |
| Request-scoped providers, `onModuleDestroy` | `provide(key, factory, { dispose })`. On Workers, every I/O object (e.g. a DB connection) must be request-scoped                 |
| Controllers, resolvers                      | Sub-apps (`new Hono().get(…)…`) mounted with `app.route("/dam", dam.routes)`                                                     |
| GraphQL schema and codegen                  | Hono RPC: the client infers request and response types from the route definitions (`hc<AppType>`), no codegen                    |
| `class-validator` DTOs, `ValidationPipe`    | zod schemas with `zValidator` (400 with the issues, like `ValidationPipe`)                                                       |
| `@RequiredPermission`, `@AffectedEntity`    | `requirePermission("dam")` middleware plus `assertScopeAllowed()` in the handler once the scope of the affected entity is known  |
| `@DisableDextinityGuards()`                 | Routes without `requirePermission` (the hashed public file and image URLs)                                                       |
| Exception filter, `NotFoundException` etc.  | `HTTPException` helpers (`notFound()`, `badRequest()` …) and `dextinityErrorHandler`, which responds with the NestJS error shape |
| MikroORM entities (`createFileEntity`)      | Drizzle tables created by `createDamSchema({ scopeKeys })`, mapped to the existing tables                                        |
| `AppModule`                                 | `createApp(config, runtimeProviders)`, with one entry point per runtime: `node.ts` and `worker.ts`                               |
| `ConfigModule`, `process.env`               | `createConfig(env)`: Workers pass the environment with each request, so configuration is a function of it                        |

The application wires it up like this (`demo/api-hono/src/app.ts`):

```ts
const dam = createDamModule({ damConfig: config.dam, Scope: DamScope });

return new Hono()
    .onError(dextinityErrorHandler)
    .use(database) // provides `db`, runtime-specific
    .use(blobStorage) // provides `blobStorage`, runtime-specific
    .use(provide("imgproxy", () => imgproxy))
    .use(authentication({ apiToken: config.apiToken })) // provides `currentUser` and `accessControl`
    .route(`/${dam.config.basePath}`, dam.routes);
```

The scope is a zod schema. Its dimensions are top-level query parameters, so the typed client knows they are required:

```ts
const api = createApiClient(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
const response = await api.dam.items.$get({ query: { domain: "main", folderId } });
const { nodes, totalCount } = await response.json(); // typed, including `scope.domain`
```

## What the DAM prototype covers

- Files: list, get (with DAM path and duplicates), update, move, archive/restore, delete, filename checks
- Upload and replace via multipart, wire-compatible with the NestJS endpoints (`scope`, `license` and `imageCropArea` as JSON fields)
- Upload validation: size, accepted MIME types, extension, maximum image resolution. Content hash, image dimensions and EXIF data
- File delivery: hashed public URLs, authenticated preview URLs, downloads, range requests, redirect for outdated filenames
- Images: hashed and preview URLs with focus or smart crop, allowed sizes and aspect ratios, imgproxy with WebP negotiation
- Folders: list, flat list, get with parents, create, update (with materialized path update of descendants), move, delete, zip download
- DAM items (folders and files combined) and the position of an item in the list
- Blob storages: R2 (Workers), file system (Node.js, same layout as `@dextinity/cms-api`), in-memory

Left out for now:

- Dominant color calculation (would run with `executionCtx.waitUntil()` on Workers), the scaled images cache (could use the Cache API), DAM media alternatives, file warnings (license expiration), `copyFilesToScope`
- Dependencies and warnings: both depend on the block index and MikroORM hooks
- SVG validation: DOMPurify needs jsdom, which doesn't run on Workers. SVG uploads are rejected unless `isValidSvg` is configured
- Blocks (`DamImageBlock` etc.), the image URL fields of block transformers, and the GraphQL `DamFileImage.url` field (`urlTemplate` is included in responses)
- Legacy file URLs without content hash

## What porting cms-api and demo/api would take

`@dextinity/cms-api` has ~30k lines with 27 modules, ~70 injectable services, ~25 entities, 37 migrations and GraphQL resolvers in most modules. The demo adds ~20 entities and resolvers, most of them generated.

### Framework-agnostic core first

Many parts of cms-api are framework-agnostic already, but they're tied to NestJS through decorators and module wiring (block definitions, URL signing, image calculations, file validation).
The prototype copies them. For a real port, extract them into a framework-agnostic package that both the NestJS and the Hono variant use during the migration.

### API surface: GraphQL → REST/RPC

This is the biggest piece of work, mostly on the admin side:

- `@dextinity/cms-admin` has ~80 files with GraphQL documents (20 in the DAM alone) using Apollo (cache, `refetchQueries`, fragments). Every one needs to move to the typed client, probably with TanStack Query as the cache.
- The admin generator produces GraphQL-based CRUD UIs. It would generate code for the typed client instead.
- The API generator (`@CrudGenerator`) generates resolvers and services from MikroORM entities. It needs to generate Hono routes and Drizzle queries from the Drizzle tables instead.
- The demo site fetches pages and their block data through GraphQL (~25 files with GraphQL documents in `demo/site`).
- GraphQL field resolvers that load relations (e.g. `DamFile.damPath`, `duplicates`) become explicit response fields or separate routes. Keep an eye on N+1 queries.

Alternative: keep GraphQL on Hono with GraphQL Yoga and Pothos. That spares the admin rewrite, but loses the end-to-end types of Hono RPC and still requires replacing the NestJS GraphQL decorators.

### Persistence: MikroORM → Drizzle

- MikroORM depends on Knex and Node.js APIs and doesn't run on Workers. Drizzle does, with postgres.js over Hyperdrive.
- Entities → Drizzle tables. Embeddables (scope, license, crop area) become prefixed columns, as in the prototype. Entity factories with an application-defined scope (`createFileEntity({ Scope })`) become schema factories.
- MikroORM's Unit of Work, cascades and lifecycle hooks (`@CreateWarnings`, `@EntityInfo`, the dependencies subscriber) become explicit code in the services. This affects block indexing, entity info and warnings.
- Migrations: the existing MikroORM migrations stay the source of truth for existing projects. New migrations with drizzle-kit, generated from the tables.
- Block index views (`createBlockIndexViews`) and full-text search use raw SQL, which ports with `sql`.

### Validation and blocks

- `class-validator`/`class-transformer` DTOs → zod. This includes the block system: block data and input classes are defined with decorators (`@BlockField`) and generate `block-meta.json`. Porting blocks to zod schemas (with a block-meta generator) is a large but self-contained piece of work, and every project's custom blocks need to be migrated, which calls for a codemod.
- Block transformers use NestJS DI (`BlockTransformerService`s with injected services). They'd get the services from the request context instead.

### Auth and permissions

- `UserPermissionsModule` (JWT via `jose`, which runs on Workers), the `AccessControlService` and impersonation become middleware that sets `currentUser` and `accessControl`, as in the prototype.
- Guards and decorators (`@RequiredPermission`, `@AffectedEntity`, `@DisableDextinityGuards`) become route middleware and checks in the handler. Unlike decorators read by a global guard, a route without middleware is unprotected, so denying by default needs care (e.g. a lint rule, or registering protected and public routes on separate sub-apps).

### Runtime dependencies on Node.js

- Multer temp files, `fs`-based storage and Node.js streams → Web Streams and in-memory uploads. Workers limit memory to 128 MB and request bodies to 100–500 MB depending on the plan, so very large uploads need direct uploads to R2 (presigned URLs).
- Azure and S3 blob storages need to be rewritten for Web Streams (the AWS SDK v3 runs on Workers, the Azure SDK needs checking). R2 covers the Cloudflare case.
- jsdom (SVG validation), `probe-image-size` (replaced with `image-size`), `nodemailer` (Workers can't open SMTP connections, use an HTTP mail API), OpenAI/Azure SDKs (fetch-based, fine).
- `nodejs_compat` covers `node:crypto`, `node:path` and `Buffer`, which the prototype uses.

### Jobs and tooling

- Console commands (`nest-commander`: migrate, fixtures, createBlockIndexViews, dominant colors) → a plain CLI script running on Node.js against the same services.
- Cron jobs (Kubernetes CronJobs, `@CronJob`) → Cloudflare Cron Triggers or Queues, the Kubernetes module stays Node.js only.
- Builds/site rebuilds, redirects, page tree, mail templates, Brevo, translation, content generation: each a module to port with the patterns above.
- OpenTelemetry and Sentry: both have Workers integrations.

### Suggested order

1. Extract the framework-agnostic core
2. Port the DAM (this prototype) and switch the DAM UI of cms-admin to the typed client, behind a flag
3. Port blocks to zod with a codemod for project blocks, then the page tree and the block-based modules
4. Port the generators
5. Remaining modules, then retire the NestJS variant

Open decisions: REST/RPC vs. GraphQL on Hono, whether to support Node.js and Workers equally (the prototype does), and the database strategy on Cloudflare (Hyperdrive with Postgres keeps compatibility, D1 would require SQLite support).
