---
"@comet/cms-site": minor
---

Add `ErrorHandlerProvider`

Each block in `BlocksBlock`, `OneOfBlock` and `ListBlock` is wrapped with an error boundary to prevent the whole page from crashing when a single block throws an error.
In production, the broken block is hidden. The application should take care of reporting the error to an error tracking service (e.g., Sentry). In local development, the error is re-thrown.

Add an `ErrorHandler` to the root layout:

```tsx
// In src/app/layout.tsx
<html>
    <body className={inter.className}>
        {/* Other Providers */}
        <ErrorHandler>{children}</ErrorHandler>
    </body>
</html>
```

The `ErrorHandler` receives the errors in the application and can report them to the error tracking service.

**Example ErrorHandler**

```tsx
"use client";

import { ErrorHandlerProvider } from "@comet/cms-site";
import { PropsWithChildren } from "react";

export function ErrorHandler({ children }: PropsWithChildren) {
    function onError(error: Error, errorInfo: ErrorInfo) {
        console.error("Error caught by error handler", error, errorInfo.componentStack);
        if (process.env.NODE_ENV === "development") {
            throw error;
        } else {
            // Report the error to the error tracking service
        }
    }

    return <ErrorHandlerProvider onError={onError}>{children}</ErrorHandlerProvider>;
}
```
