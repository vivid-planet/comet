---
title: Authorization
sidebar_position: 10
---

TODO general information about how we handle authorization

## Available Decorators

### @PublicApi

`@PublicApi()` can be used to expose a single handler (query, mutation or route) or a whole class (resolver or controller) publicly.

:::caution

Using the decorator at class level causes later added handlers to be automatically public. Prefer using the decorator for single handlers only.

:::

### @DisableCometGuards

`@DisableCometGuards()` disables the global auth guards (`CometAuthGuard`, `UserPermissionsGuard`). This may be used if a different authentication method is desired (e.g., basic authentication) for a specific handler or class. It should be used in combination with a custom guard. The custom guard may leverage `@PublicApi` as well to expose handlers publicly.

e.g.:

```typescript
@DisableCometGuards()
@UseGuards(MyCustomGuard)
async handlerThatUsesACustomGuard(): {
    ...
}
```
