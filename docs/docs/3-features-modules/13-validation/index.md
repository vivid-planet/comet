---
title: Validation
---

COMET DXP provides custom validation decorators for use with [class-validator](https://github.com/typestack/class-validator) in NestJS DTOs.

## @IsUndefinable()

Use `@IsUndefinable()` to allow a field to be `undefined` while still validating it when a value is provided.

This is more specific than the `@IsOptional()` decorator from `class-validator`, which allows both `undefined` and `null`.

```ts
import { IsUndefinable } from "@comet/cms-api";
import { IsString } from "class-validator";

class UpdateProductInput {
    @IsUndefinable()
    @IsString()
    name?: string;
}
```

## @IsNullable()

Use `@IsNullable()` to allow a field to be `null` while still validating it when a value is provided.

This is more specific than the `@IsOptional()` decorator, which also allows `undefined`.

```ts
import { IsNullable } from "@comet/cms-api";
import { IsString } from "class-validator";

class UpdateProductInput {
    @IsNullable()
    @IsString()
    name: string | null;
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
