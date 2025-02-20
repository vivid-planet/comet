---
title: Data-driven applications
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
export class Product extends BaseEntity {
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

In data-driven applications, the scope system is primarily used for controlling permissions. Please refer to [Evaluate Content Scopes](evaluate-content-scopes) which is heavily used in data-driven applications.
