---
title: Authentication
sidebar_position: 10
---

TODO general information about how we handle authentication

## Available Decorators

### @PublicApi

`@PublicApi()` can be used to expose a handler (one query or one route) or a whole class (resolver or controller) publicly.

:::caution

Use with caution at class level because later added handlers are automatically public.

:::

### @DisableGlobalAuthGuard

`@DisableGlobalAuthGuard()` can disable the global auth guard (`CometAuthGuard`). This can be used if a different authentication method is desired (e.g., basic authentication). Assign a class a custom guard with `@UseGuards`. The custom guard can leverage `@PublicApi` as well to expose handlers publicly.
