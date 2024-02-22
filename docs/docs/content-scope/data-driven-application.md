---
title: Data driven application
sidebar_position: 2
---

In data driven applications you may also use the scope, but the usage is quite differently, as you usually have not this clear separations of scopes as for content websites.

If the scope is more like the "goggles" the user is currently looking through, then use the following approach:


### API: Database

If your scopes are relations to entities in your application (e.g., dealers or clubs), do not store this relation or ID in a nested `scope` embeddable (as you would for a content website), instead use a standard `@ManyToOne` relation:

```ts title="api/src/product/entities/product.entity.ts"
@Entity()
export class Product extends BaseEntity<Product, "id"> {
    @ManyToOne(() => Dealer, { ref: true })
    dealer: Ref<Dealer> = undefined;
}
```
### API: GraphQL API

As in the database, do not use an argument named `scope` for any operation that contains references. Instead use a normal reference like you would always do.

### Admin: Scope Selector

You _might_ want to use the `<ContentScopeControls>` in Admin to get the default scope selector. However, it is very limited and you might better be off with a custom component that fetches scopes (e.g., dealers) on it's own.

You can use `useContentScope()` to access the currently selected scope, but you will usually access only the ID defined in the scope object and pass it to operations that depend on the currently selected scope:

```tsx
const { scope } = useContentScope();
const variables = {
    dealer: scope.dealer
};
```

### API: User permissions

So far COMET didn't help us a lot with our scope, but for user permssions it has its value.

First an overview of user permissions:

- Every user has access to resolvers with permissions (e.g., "products") - not covered here
- Every user has access to scopes

(Both are defined by rule in `AccessControlService` or can be overridden manually per user in the Admin)

- And every entity belongs to a scope

Now user permissions needs to check for every request if the entity scope and the user scope match.

#### @ScopedEntity
Use this decorator at entity level to return the scope of an entity. You might have to load multiple relations for nested data.
```ts
@ScopedEntity(async (product: Product) => {
    return {
        dealer: product.dealer.id
    };
})
@Entity()
export class Product extends BaseEntity<Product, "id"> {}
```

#### @AffectedEntity
Use this decorator at operation level to specify which entity (and thus scope) is affected by the operation.
```ts
    @Query(Product)
    @AffectedEntity(Product)
    async product(@Args("id", { type: () => ID }) id: string): Promise<Product> {
        //...
    }
```

```ts
    @Query([Product])
    @AffectedEntity(Dealer, { idArg: "dealer" })
    async products(@Args("dealer", { type: () => ID }) dealer: string): Promise<Product[]> {
        // Note: you can trust "dealer" being in a valid scope, but you need to make sure that your business code restricts this query to the given dealer
    }
```
