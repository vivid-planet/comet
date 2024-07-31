---
"@comet/cms-api": minor
---

Add Sentry module to simplify integration with Sentry.

### Usage:

```ts
// main.ts

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
```

```ts
// app.module.ts

SentryModule.forRootAsync({
    dsn: "sentry_dsn_url",
    environment: "dev",
    shouldReportException: (exception) => {
        // Custom logic to determine if the exception should be reported
        return true;
    },
}),
```
