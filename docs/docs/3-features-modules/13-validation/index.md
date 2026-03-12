---
title: Validation
---

COMET DXP provides custom validation decorators for use with [class-validator](https://github.com/typestack/class-validator) in NestJS DTOs.

## @IsUndefinable()

Use `@IsUndefinable()` to allow a field to be `undefined` while still validating it when a value is provided.

This is more specific than the `@IsOptional()` decorator from `class-validator`, which allows both `undefined` and `null`.

A typical use case is a small inline form that only updates a subset of an entity's fields (e.g., only the name). Fields not present in the form are omitted from the request body entirely (`undefined`) and should be left unchanged on the server.

```ts
import { IsUndefinable } from "@comet/cms-api";
import { IsString } from "class-validator";

class UpdateProductInput {
    @IsUndefinable()
    @IsString()
    name?: string;

    @IsUndefinable()
    @IsString()
    description?: string;
}
```

## @IsNullable()

Use `@IsNullable()` to allow a field to be `null` while still validating it when a value is provided.

This is more specific than the `@IsOptional()` decorator, which also allows `undefined`.

A typical use case is resetting or clearing an optional value (e.g., removing a product's assigned category).

```ts
import { IsNullable } from "@comet/cms-api";
import { IsString } from "class-validator";

class UpdateProductInput {
    @IsNullable()
    @IsString()
    category: string | null;
}
```

## Replacing @IsOptional()

The `@IsOptional()` decorator from `class-validator` allows both `undefined` and `null`. This can lead to unintentional bugs.

Use `@IsUndefinable()` or `@IsNullable()` to be more specific about which values are allowed:

| Decorator | Allows `undefined` | Allows `null` |
| --- | :---: | :---: |
| `@IsOptional()` | ✅ | ✅ |
| `@IsUndefinable()` | ✅ | ❌ |
| `@IsNullable()` | ❌ | ✅ |

## PartialType

COMET DXP provides its own `PartialType` helper (from `@comet/cms-api`) that uses `@IsUndefinable()` instead of `@IsOptional()`.

When creating partial input types, use `PartialType` from `@comet/cms-api` instead of `@nestjs/mapped-types`:

```ts
import { PartialType } from "@comet/cms-api";

import { CreateProductInput } from "./create-product.input";

export class UpdateProductInput extends PartialType(CreateProductInput) {}
```
