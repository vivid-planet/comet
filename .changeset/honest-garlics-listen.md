---
"@comet/admin": minor
---

Extend error details in `ErrorDialog`

Previously, uncaught errors in production environments would result in an "An error occurred" `ErrorDialog`, making the error difficult to debug.
To improve the reproducibility of an error, we enrich the `ErrorDialog` with the following `additionalInformation`:

-   `errorType`: The type of the error, network or server error
-   `httpStatus`: The HTTP status of the request that failed
-   `url`: The URL where the error occurred
-   `timestamp`: The timestamp when the error occurred

This information will be displayed in the `ErrorDialog` if no custom `userMessage` has been provided.
In addition, a button has been added to allow this information to be copied to the clipboard.
