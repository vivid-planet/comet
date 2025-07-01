---
"@comet/admin-generator": major
"@comet/api-generator": major
"@comet/cms-api": major
---

Use `GraphQLLocalDate` instead of `GraphQLDate` for date-only columns

The `GraphQLDate` scalar coerces strings (e.g., `2025-06-30`) to `Date` objects when used as an input type.
This causes problems when used in combination with MikroORM v6, which treats date-only columns as strings.
Since using strings is preferred, the `GraphQLLocalDate` scalar is used instead, which performs no type coercion.

**How to upgrade**

1. Use `string` instead of `Date` for date-only columns:

```diff
class Product {
    @Property({ type: types.date, nullable: true })
    @Field(() => GraphQLDate, { nullable: true })
-   availableSince?: Date = undefined;
+   availableSince?: string = undefined;
}
```

2. Use `GraphQLLocalDate` instead of `GraphQLDate`:

```diff
- import { GraphQLDate } from "graphql-scalars";
+ import { GraphQLLocalDate } from "graphql-scalars";

class Product {
    @Property({ type: types.date, nullable: true })
-   @Field(() => GraphQLDate, { nullable: true })
+   @Field(() => GraphQLLocalDate, { nullable: true })
    availableSince?: string = undefined;
}
```

3. Add the `LocalDate` scalar to `codegen.ts`:

```diff
scalars: rootBlocks.reduce(
    (scalars, rootBlock) => ({ ...scalars, [rootBlock]: rootBlock }),
+   { LocalDate: "string" }
)
```
