---
title: Access Control in the API
sidebar_position: 2
---

:::note

The term **operation** stands for the locations in which COMET DXP invokes permission checks:

-   Queries/Mutations in GraphQL-resolvers
-   Routes in REST-controllers

Normally you want to decorate the methods of these classes, however, decorating the whole class is also possible.
:::

After activating the module, COMET DXP checks every operation for the required permissions and scopes. Therefore it is necessary to decorate the operations to let the system know what to check. COMET DXP then checks if the current user possesses the permission defined in the decorator.

Additionally, the scope of the data in operation will be checked against the scope of the users. To achieve this, the system has to know the scope of the data that is being handled right now.

:::note
You might also want to check the permissions on field resolvers. To do that, you have to add `guards` to `fieldResolverEnhancers` in the configuration of the GraphQL-module. Please be aware that field resolvers are only checked for permissions but not for scopes.
:::

## Permission check

**@RequiredPermission**

This decorator is mandatory for all operations. The first parameter of type `string | string[] | "disablePermissionCheck"` configures which permission is necessary to access the decorated operation.

The core of COMET DXP already defines a list of permissions (e.g. `pageTree`, `dam`, `cronJobs`, `userPermissions`). Permissions are defined as plain strings, in the most basic case they represent the main items of the menu bar in the administration panel.

However, if you need a more fine-grained access control you might want to concatenate strings, e.g. `newsRead` or `newsCreate`. Only create as many permissions as really necessary.

:::info
Future version will support a dot-like notation (e.g. `news` will subsume `news.read` and `news.write`).
:::

## Scope check

:::caution
COMET DXP validates the data relevant for the operation, but cannot check if the validated data is finally used. You are responsible for applying the validated data in your operations.
:::

To evaluate the scope there a two technically very distinctive ways depending on the type of operation:

### Operations that create entities or query lists

If an operation does not handle existing entities, the scope has to be passed as an argument. COMET DXP expects the argument to be named `scope` in order to be able to validate it. So do not forget to provide the `scope` argument in your operation.

### Operations that handle specific entities

**@AffectedEntity**

COMET DXP needs information on which entities are being handled in the operation (= which entities are affected). Therefore, every operation of this kind needs to be marked with this decorator.

Use this decorator at the **operation level** to specify which entity (and thus scope) is affected by the operation.

:::info
By default COMET DXP tries to load the affected entity by id with the value of the submitted id-argument. However, the name of the argument can be altered by using the `idArg` setting.
:::

```ts
@Query(Product)
@AffectedEntity(Product)
async product(@Args("id", { type: () => ID }) id: string): Promise<Product> {
    //...
}
```

```ts
@Query([Product])
@AffectedEntity(Dealer, { idArg: "dealerId" })
async products(@Args("dealerId", { type: () => ID }) dealerId: string): Promise<Product[]> {
    // Note: you can trust "dealerId" being in a valid scope, but you need to make sure that your business code restricts this query to the given dealer
}
```

**@ScopedEntity**

Retrieving the affected entity alone is not sufficient, COMET DXP also needs to know the scope of the entity. The simplest case is when the entity has a field named `scope`. If this is true, this decorator is not necessary.

If the scope is stored in a different field or the entity has a relation to another entity that stores the scope, additional information is required. This is where this decorator comes into play.

Use this decorator at the **entity level** to return the scope of an entity.

```ts
@ScopedEntity(async (product: Product) => {
    return {
        dealer: product.dealer.id,
    };
})
@Entity()
export class Product extends BaseEntity<Product, "id"> {}
```

:::info
You might have to load multiple relations for nested data.
:::

## Disable permission/scope checks

**skipScopeCheck**

The scope check can be disabled by adding `{skipScopeCheck: true}` as the second argument of the `@RequiredPermission` decorator.

:::caution
Use this option only when you are sure that checking the scope is not necessary (e.g. the current entity does not have a scope). Do not add it just because it seems cumbersome at the moment to add the correct `AffectedEntity`/`ScopedEntity` decorators.
:::

:::note
Try to avoid using the `@GetCurrentUser` decorator. Instead, you should explicitly send all the data needed in an operation. In the following example, this requires adding `userId` as a scope part as well as passing the data throughout the client. Nevertheless, this leads to a cleaner API design.

```diff
- @RequiredPermission("products", {skipScopeCheck: true})
+ @RequiredPermission("products")
+ @AffectedEntity(User)
- async myProducts(@GetCurrentUser() currentUser: CurrentUser): Promise<Product[]> {
+ async productsForUser(@Args("userId", { type: () => ID }) userId: string): Promise<Product[]> {
      //...
  }
```

:::

**@PublicApi**

`@PublicApi()` can be used to expose a single handler (query, mutation or route) or a whole class (resolver or controller) publicly.

:::caution

Using the decorator at class level causes later added operations to be automatically public. Prefer using the decorator for single operations only.

:::

**@DisableGlobalGuard**

`@DisableGlobalGuard()` disables the global auth guard (`CometAuthGuard`). This may be used if a different authentication method is desired (e.g., basic authentication) for a specific handler or class. It should be used in combination with a custom guard. The custom guard may leverage `@PublicApi` as well to expose handlers publicly.

e.g.:

```typescript
@DisableGlobalGuard()
@UseGuards(MyCustomGuard)
async handlerThatUsesACustomGuard(): {
    ...
}
```
