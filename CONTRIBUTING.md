# Contributing

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md).  
By participating in this project, you agree to abide by its terms.

## Development

To run Comet DXP locally, see [Getting started](README.md#getting-started) in our README.

## Versioning & branches

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Pull requests with minor or patch changes should target the [`main`](https://github.com/vivid-planet/comet/tree/main) branch, while major/breaking changes should target the [`next`](https://github.com/vivid-planet/comet/tree/next) branch.

### Changesets

Changes are documented using [changesets](https://github.com/changesets/changesets). Make sure to [add a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) when making a notable change.

#### When to add a changeset

A changeset should be added when:

-   changing the package's public API (`src/index.ts`), for instance, adding a new component
-   fixing a bug
-   making a visual change, for instance, changing a component's design

A changeset should not be added when:

-   making a package internal change
-   changing the dev setup or workflows

In general, you should add a changeset when you want your change to result in a new package version.

#### Changeset writing guidelines

Follow this guidelines when writing a changeset:

-   Use active voice: "Add new thing" vs. "A new thing is added"
-   The first line should be the title (without a period at the end): "Add new alert component"
-   If necessary, provide additional information in the description
-   Use backticks to highlight code: Add new `Alert` component
-   Use bold formatting for "headlines": **Example**

Example for a good changeset:

````md
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
````
