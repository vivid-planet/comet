---
title: Authorization
sidebar_position: 10
---

TODO general information about how we handle authorization

## Available Decorators

### @DisableCometGuards

`@DisableCometGuards()` disables the global auth guards (`CometAuthGuard`, `UserPermissionsGuard`). This may be used if a different authentication method is desired (e.g., basic authentication) for a specific handler or class in combination with a custom guard.

e.g.:

```typescript
@DisableCometGuards()
@UseGuards(MyCustomGuard)
async handlerThatUsesACustomGuard(): {
    ...
}
```
