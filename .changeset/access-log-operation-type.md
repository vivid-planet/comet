---
"@comet/cms-api": minor
---

Pass the GraphQL `operationType` to the `AccessLogModule`'s `shouldLogRequest` option

This makes it possible to log requests based on their operation type, for instance to filter out the system user's requests while still logging its mutations:

```ts
AccessLogModule.forRoot({
    shouldLogRequest: ({ user, operationType }) => {
        if (user === "system-user" && operationType !== OperationTypeNode.MUTATION) {
            return false;
        }
        return true;
    },
}),
```

`operationType` is `undefined` for non-GraphQL (HTTP) requests.
