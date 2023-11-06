---
title: Access Logging
sidebar_position: 2
---

There is an option to enable global access logging, where request data is logged in the standard console. The following information is logged:

-   Timestamp
-   Request type (GraphQL or HTTP)
-   IP address
-   User (if available)

For GraphQL requests, the following additional information is logged:

-   Operation type
-   Operation name
-   Resolver function name
-   For queries, the arguments (args)
-   For mutations, the arguments excluding the input and data properties

For HTTP requests, the following is logged:

-   The HTTP method
-   The route
-   For GET requests, the parameters

The access log allows to see who accessed what data and when. This information for example can be used to identify security vulnerabilities.

## Configure AccessLog in app.module

The optional function `filterRequest` provides the ability to disable logging for various functions. For example, requests executed during a build should not be logged. In this function, you have access to the user and the request object. If the function returns `true`, the log will not be executed for this condition.

There are two options for implementing the module:

**1 option:**

```ts
imports: [
    ...
    AccessLogModule,
    ...
]
```

**2 option:**

```ts
imports: [
    ...
    AccessLogModule.forRoot({
        filterRequest: ({user, req}) => {
            // do something
            return true;
        },
    }),
    ...
]
```
