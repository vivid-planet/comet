---
"@comet/admin": minor
---

Add `onError` prop to `ErrorBoundary`

Allows hooking into React render errors for external error reporting (e.g. Sentry) without replacing the built-in error UI.

```tsx
import * as Sentry from "@sentry/react";
import { ErrorBoundary } from "@comet/admin";

<ErrorBoundary onError={(error, errorInfo) => Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } })}>
    <App />
</ErrorBoundary>;
```
