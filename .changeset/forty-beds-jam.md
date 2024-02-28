---
"@comet/cms-api": patch
---

Disable logging in `AccessLogModule` in development per default

You can enable the logging for testing purposes by overriding the `shouldLogRequest` option:

```ts
AccessLogModule.forRoot({ shouldLogRequest: () => true })
```
