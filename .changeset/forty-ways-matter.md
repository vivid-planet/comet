---
"@comet/cms-api": minor
---

API Generator: Change default value for property of `InputType` if property has no initializer in entity

Previously, the following property for an entity

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

1.  You would receive a misleading error message if you tried to create an entity without providing a value for the property. For example:

```graphql
mutation CreateProduct {
    createProduct(input: { title: "A", slug: "A", description: "FOO" }) {
        id
        availableSince
    }
}
```

resulted in the following error

```
"isDate": "availableSince must be a Date instance"
```

2. Relying on the initializer as the default value is not obvious and appears somewhat magical.

To address this, we now use null as the default value for nullable properties if no initializer is provided. If an initializer is provided, it is used as the default value.
