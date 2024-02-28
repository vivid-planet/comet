---
"@comet/cms-api": patch
---

Disable logging in `AccessLogModule` in development per default

You can enable the logging by setting the `enableLoggingInDevelopment` option:

```ts
AccessLogModule.forRoot({ enableLoggingInDevelopment: true })
```
