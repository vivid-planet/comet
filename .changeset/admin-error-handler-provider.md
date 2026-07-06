---
"@comet/admin": minor
---

Add `ErrorHandlerProvider` and `useErrorHandler` for centralized error reporting from `ErrorBoundary`

`ErrorBoundary` now invokes an optional `onError(error, errorInfo)` callback provided through `ErrorHandlerProvider`'s context whenever it catches an error. The visible Alert UI of `ErrorBoundary` is unchanged — the callback is purely additive and intended for forwarding errors to a reporting service (e.g., Sentry).

**Example**

```tsx
import { ErrorHandlerProvider } from "@comet/admin";

<ErrorHandlerProvider
    onError={(error, errorInfo) => {
        // Report the error to your error tracking service
        console.error(error, errorInfo.componentStack);
    }}
>
    {children}
</ErrorHandlerProvider>;
```
