---
"@comet/blocks-api": minor
---

Improve typing of `@RootBlockEntity()` decorator

The target entity can now be passed as generic to have the correct type in `isVisible`:

```ts
@RootBlockEntity<Product>({
    isVisible: (product) => product.visible,
})
export class Product extends BaseEntity<Product, "id"> {}
```
