---
title: Demo Application
sidebar_position: 3
---

The demo application starts automatically when executing `pnpm run dev`. However, if you only want to run the demo itself, you can execute `dev-pm start @demo` (make sure to build the packages beforehand with `pnpm run build:packages`).

### Services of the demo application

- Docker

    Starts a variety of supporting modules (`imgproxy`, `redis`, `oauth2-proxy`, `postgres`, `jaeger`). The `demo-oidc-provider` service also counts as a supporting service even though it`s started directly and not via docker.

- API

    A NestJS application which mainly provides a GraphQL-API for the latter services.

- Admin

    The administration panel used to manage the content.

- Site

    A Next.JS application utilizing the API as data source for the content.

### Structure of the demo application

The Admin can be reached under http://localhost:8000. However, this port is connected with the `oauth2-proxy`, which handles the authorization with the `demo-oidc-provider` and then proxies the Admin and the API. This setup is very similar to a production setup as it requires a real authentication. The available users however are defined in `demo/api/src/auth/static-users.ts` and will be presented to choose from in the login process.

The site is available under http://localhost:3000. It does not have authentication.
