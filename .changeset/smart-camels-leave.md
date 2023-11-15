---
"@comet/cms-api": minor
---

Add `DependenciesResolverFactory` and `DependentsResolverFactory` to easily add field resolvers for the `dependencies` or `dependents` of an entity

You can use the factories as follows:

```ts
@Module({
    // ...
    providers: [ExampleResolver, DependenciesResolverFactory.create(Example), DependentsResolverFactory.create(Example)],
    // ...
})
export class ExampleModule {}
```
