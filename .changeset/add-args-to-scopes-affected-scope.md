---
"@comet/cms-api": minor
---

Allow `AffectedScope` to return multiple scopes

The `argsToScope` function can now return `ContentScope[]` in addition to a single `ContentScope`. When multiple scopes are returned, the user must have access to all of them (AND relationship).

```ts
@AffectedScope((args: MyArgs) => [{ domain: args.fromDomain }, { domain: args.toDomain }])
```
