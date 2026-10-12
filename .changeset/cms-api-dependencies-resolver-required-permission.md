---
"@dextinity/cms-api": major
---

Require the permission in `DependenciesResolverFactory` and `DependentsResolverFactory`

The `dependencies` and `dependents` field resolvers created by the factories required the `dependencies` permission for every entity.
They now require the permission passed to the factory, so access follows the permission of the entity:

```diff
- DependenciesResolverFactory.create(News),
- DependentsResolverFactory.create(News),
+ DependenciesResolverFactory.create({ entity: News, requiredPermission: "news" }),
+ DependentsResolverFactory.create({ entity: News, requiredPermission: "news" }),
```
