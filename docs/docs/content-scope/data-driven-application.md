---
title: Data-driven applications
sidebar_position: 2
---

You can also use the scope in data-driven applications. However, the usage is quite different compared to content websites:

In content websites, one scope usually represents the data attached to one domain and/or language. Meaning, the data is clearly separated by the scopes.

In data-driven applications, switching between scopes in the admin interface might feel more like switching between different views. The view determines what data is displayed and how it is displayed. But the same data might be displayed in multiple different scopes, meaning it's not strictly attached to one scope.

If you are building a data-driven application, use the following approach:

### API: Database

Oftentimes, your scopes might be derived from specific entities. For example, let's say you have a `Dealer` entity representing a car dealership. In the admin interface, you want to add a scope that displays the data related to this dealership.

In the database, this is represented by a relation to the `Dealer`. **Do not store this relation or ID in a nested `scope` embeddable** (as you would for a content website). Instead, use a standard `@ManyToOne` relation:

```ts title="api/src/product/entities/product.entity.ts"
@Entity()
export class Product extends BaseEntity<Product, "id"> {
    @ManyToOne(() => Dealer, { ref: true })
    dealer: Ref<Dealer> = undefined;
}
```

### API: GraphQL API

As in the database, do not use an argument named `scope` containing references for any operation. Instead, use a reference as you would do normally.

### Admin: Scope Selector

You _might_ want to use the `ContentScopeControls` in Admin to get the default scope selector. However, it's very limited and you might be better off with a custom component that fetches scopes (e.g., dealers) on its own.

You can use `useContentScope()` to access the currently selected scope, but usually you will only access the ID defined in the scope object and pass it to operations that depend on the currently selected scope:

```tsx
const { scope } = useContentScope();
const variables = {
    dealer: scope.dealer,
};
```

### API: User permissions

Data-driven applications don't benefit much from the COMET scope system. But for user permissions it has its value.

First, an overview of user permissions:

-   Every user has permissions that give them access to resolvers (e.g., "products") - not covered here
-   Every user has access to scopes

(Both are defined by rule in `AccessControlService` or can be overridden manually per user in the Admin)

-   Every entity belongs to a scope

(The user permission feature checks for every request if the entity scope and the user's allowed scopes match.)

#### @ScopedEntity

Use this decorator at entity level to return the scope of an entity. You might have to load multiple relations for nested data.

```ts
@ScopedEntity(async (product: Product) => {
    return {
        dealer: product.dealer.id,
    };
})
@Entity()
export class Product extends BaseEntity<Product, "id"> {}
```

#### @AffectedEntity

Use this decorator at the operation level to specify which entity (and thus scope) is affected by the operation.

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
