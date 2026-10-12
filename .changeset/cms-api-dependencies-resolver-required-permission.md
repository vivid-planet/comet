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

The `dependencies` permission is removed. The `scope` field of `Dependency` no longer checks a permission, because the field that returns the `Dependency` already does.

A user with the permission of an entity can see all its dependents and dependencies, also those the user has no permission for or that are in content scopes the user has no access to.
