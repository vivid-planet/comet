---
"@comet/cms-api": minor
---

Add access logging to log information about the request to standard output. The log contains information about the requester and the request itself. This can be useful for fulfilling legal requirements regarding data integrity or for forensics.

There are two ways to integrate logging into an application:

**First option: Use the default implementation**

```ts
imports: [
    ...
    AccessLogModule,
    ...
]
```

**Second option: Configure logging**

Use the `shouldLogRequest` to prevent logging for specific requests. For instance, one may filter requests for system users.

```ts
imports: [
    ...
    AccessLogModule.forRoot({
        shouldLogRequest: ({user, req}) => {
            // do something
            return true; //or false
        },
    }),
    ...
]
```

More information can be found in the documentation under 'Authentication > Access Logging'.
