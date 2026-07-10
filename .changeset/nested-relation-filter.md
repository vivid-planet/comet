---
"@comet/api-generator": minor
"@comet/admin-generator": minor
"@comet/cms-api": minor
"@comet/admin": minor
---

Support filtering DataGrids by nested relation fields

Relations can now be filtered by the fields of the related entity (e.g. filter products by `category.type.title`), not just by the related entity's ID.

**API**

Opt a `ManyToOne` relation into nested filtering with the new `@CrudField` filter option. The API Generator then exposes the related entity's filter instead of the ID-based `ManyToOneFilter`:

```ts
@ManyToOne(() => ProductCategory, { nullable: true, ref: true })
@CrudField({ filter: { nested: true } })
category?: Ref<ProductCategory>;
```

The related entity must have a generated filter (`@CrudGenerator`). Nesting works across multiple levels, so annotating `ProductCategory.type` as well enables `category: { type: { title: { contains: "..." } } }`. `filtersToMikroOrmQuery` resolves these nested filters and lets MikroORM join the relations.

Since a nested relation filter no longer exposes a top-level `equal` (the id now lives in the nested `id` filter), the Admin Generator's `asyncSelect`/`asyncSelectFilter` filters emit `{ relation: { id: { equal } } }` for such relations (and `{ relation: { equal } }` for id-based `ManyToOneFilter` as before).

**Admin**

`GqlFilter` (the return type of a column's `toGqlFilter`) now allows nested filter objects, so a column can map to a nested relation filter:

```tsx
{
    field: "categoryType",
    filterOperators: getGridStringOperators().filter((operator) => operator.value === "contains"),
    toGqlFilter: (filterItem) => ({ category: { type: { title: { contains: filterItem.value } } } }),
}
```
