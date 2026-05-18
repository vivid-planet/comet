---
"@comet/cms-admin": minor
---

Add `onError` to `CometConfig` for centralized error reporting from all error boundaries

`CometConfigProvider` now accepts an optional `onError(error, errorInfo)` callback that is invoked whenever any descendant `ErrorBoundary` catches an error. Use this to forward errors to a reporting service such as Sentry.

**Example**

```tsx
<CometConfigProvider
    {...config}
    onError={(error, errorInfo) => {
        // Report the error to your error tracking service
        console.error(error, errorInfo.componentStack);
    }}
>
    {children}
</CometConfigProvider>
```
