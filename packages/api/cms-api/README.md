# CMS-API

## Sentry Module

```ts
// main.ts

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
```

```ts
// app.module.ts

SentryModule.forRoot({
    dsn: "sentry_dsn_url",
    enviroment: "dev",
}),
```

Please use @sentry/wizard to configure uploading source maps

```
npx @sentry/wizard@latest -i sourcemaps
```
