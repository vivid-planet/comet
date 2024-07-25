---
"@comet/cms-api": minor
---

API Generator: Change default value for input field if property has no initializer

Previously, the following property of an entity

```ts
@Property({ type: types.date, nullable: true })
@Field({ nullable: true })
availableSince?: Date;
```

resulted in the following input being generated:

```ts
@IsNullable()
@IsDate()
@Field({ nullable: true })
availableSince?: Date;
```

This was problematic for two reasons:

1.  The error message would be misleading when trying to create an entity without providing a value for the property. For example, a valid GraphQL mutation

    ```graphql
    mutation CreateProduct {
        createProduct(input: { title: "A", slug: "A", description: "FOO" }) {
            id
            availableSince
        }
    }
    ```

    would result in the following error:

    ```
    "isDate": "availableSince must be a Date instance"
    ```

2.  Relying on the initializer as the default value is not obvious and appears somewhat magical.

To address this, we now use `null` as the default value for nullable properties if no initializer is provided. If an initializer is provided, it is used as the default value.
