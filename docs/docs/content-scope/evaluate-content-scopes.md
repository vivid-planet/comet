---
title: Evaluate Content Scopes
sidebar_position: 3
---

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

It's possible to add multiple `@AffectedEntity` decorators to one operation if multiple entities are affected:

```ts
@Query(Product)
@AffectedEntity(Product)
@AffectedEntity(Dealer, { idArg: "dealerId" })
async product(@Args("id", { type: () => ID }) id: string, @Args("dealerId", { type: () => ID }) dealerId: string): Promise<Product> {
    //...
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
