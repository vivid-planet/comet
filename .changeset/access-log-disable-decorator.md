---
"@comet/cms-api": minor
---

Add `DisableAccessLog` decorator to exclude routes from the access log

Annotate a controller or route handler with `@DisableAccessLog()` to prevent the `AccessLogInterceptor` from logging it. This replaces the previously hardcoded list of ignored DAM paths, which relied on brittle route-string matching and stopped excluding the DAM file download route (`/dam/files/:hash/...`) after the Express 5 upgrade changed the route syntax.
