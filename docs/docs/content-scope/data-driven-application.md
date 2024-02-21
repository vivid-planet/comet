---
title: Data Driven Application
sidebar_position: 2
---

In data driven applications you can also use the scope, but quite differently as you usually have not this clear separations of scopes  as for content websites.

If the scope is more the goggles the user is currently looking thru, then use the following approach:


### Api: Database

If your scopes are relations to entities in your application (such as Dealers, Clubs), do not store this relation or id nested in a scope emeddable (as you would to for a content website), instead use a standard `@ManyToOne` relation:

```ts title="api/src/product/entities/product.entity.ts"
@Entity()
export class Product extends BaseEntity<Product, "id"> {
    @ManyToOne(() => Dealer, { ref: true })
    dealer: Ref<Dealer> = undefined;
}
```
### Api: Graphql Api

Like in the database, do not use an argument named "scope" for any query/mutation that contains references. Instead use a normal reference like you would always do.

### Admin: Scope Selector

You /might/ want to use the `<ContentScopeControls>` in admin to get the default scope selector. However it is very limited and you might better be off with a custom component that fetches scopes (eg. dealers) on it's own.

You can use `useContentScope()` to access the currently selected scope, but you will usually access only the one id out of it and pass it to queries that depend on the currently selected scope:

```
const { scope } = useContentScope();
const variables = {
    dealer: scope.dealer
};
```

### Api: UserPermissions

So far COMET didn't help us a lot with our scope, but for UserPermissions it has it's value.

First an overview of user permissions:

- Every user has access to resolvers with permissions (e.g., "products") - not covered here
- Every user has access to scopes

(Both are defined by rule in `AccessControlService` or can be overridden manually per user in the Admin)

- And every entity belongs to a scope

Now UserPermissions needs to check for every request if the entity scope and the user scope match.

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
Use this decorator at query/mutation level to specify which entity (and thus scope) is affected by the query/mutation.
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
        //note: you can trust "dealer" beeing in a valid scope, but you need to make sure that your business code restricts this query to the given dealer
    }
```
