---
"@comet/cms-site": minor
---

Add `ErrorHandlerProvider`

An `ErrorBoundary` was put around each block in the `BlocksBlock`, `OneOfBlock` and `ListBlock` to prevent the whole page from crashing in SSR applications. Instead of crashing the whole page, the broken block is hidden in the production build. In local development, the block still throws an error. Since a broken block is invisible on built applications, the application should take care of reporting the error (for example, to an error handling tool like Sentry).

**ErrorHandler should be added in layout.ts :**

```tsx
<html>
    <body className={inter.className}>
        {/* Other Providers */}
        <ErrorHandler>{children}</ErrorHandler>
    </body>
</html>
```

The ErrorHandler receives the errors in the application and can report the error in production mode.

**ErrorHandler**

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
            // Log the error to an error tracking service
        }
    }

    return <ErrorHandlerProvider value={{ onError }}>{children}</ErrorHandlerProvider>;
}
```
