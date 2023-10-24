---
"@comet/cms-api": minor
"comet-docs": minor
---

Add AccessLog Interceptor where request data is logged in the standard console. The access log allows to see who accessed what data and when. This information for example can be used to identify security vulnerabilities.

There are two options for implementing the module in the app:

**1 option:**

```ts
imports: [
    ...
    AccessLogModule,
    ...
]
```

**2 option:**

With the second option, there is the opportunity to add a callback function called `filterAuthenticatedRequest`. This function provides the ability to disable logging for various functionalities.

```ts
imports: [
    ...
    AccessLogModule.forRoot({
        filterAuthenticatedRequest: ({user, authHeader}) => {
            // do something
            return true;
        },
    }),
    ...
]
```

More information can be found in the documentation under 'Authentication > Access Logging'.
