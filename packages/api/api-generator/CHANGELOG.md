# @comet/api-generator

## 8.0.0

### Major Changes

- f904b71: Require Node v22

    The minimum required Node version is now v22.0.0.
    See the migration guide for instructions on how to upgrade your project.

- 8e193a3: Introduce a strongly-typed permission system using the new `Permission` GraphQL enum and `Permission` type, replacing previous string-based permissions.

    **Breaking changes**
    1. **Mandatory `requiredPermission`**: The `@CrudGenerator` decorator now requires the `requiredPermission` parameter to be explicitly specified
    2. **Permission Type Changes**: All permission-related APIs now expect typed permissions instead of plain strings

- 8ef9a56: Use `GraphQLLocalDate` instead of `GraphQLDate` for date-only columns

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

- 678bb0b: Move API Generator into separate `@comet/api-generator` package

    It can be run with the same `comet-api-generator` command as before.

- 28d572b: Remove special `status` field behavior

### Minor Changes

- 9cf2160: API Generator: Add new option `single` to `@CrudGenerator` which allows to enable/disable the single query
- 7e89a91: Add input support for custom mikro-orm types, the `@Field` type must also be an `@InputType`
- 3018f67: Always generate GraphQL input

    Generate the input even if `create` and `update` are both set to `false`.
    The input is still useful for other operations, e.g., a custom create mutation.

- 74c4fa7: Use the Entity Manager for all MikroORM operations
- 0328fa3: API Generator: Add support for filtering `ID` fields
- ce6d3cd: Add basic support for inheritance used by entities
- d8c62ef: Add watch (`--watch`) and single file (`--file`) modes

### Patch Changes

- 0ee3e04: Exit without an error code when no entities are found
- 4186bbb: Activate transpileOnly for better performance and fix enum issue we have with it
- e5b3b3d: Improve Performance: Don't format generated files with eslint anymore

    When scaffolding run eslint as first step.

- Updated dependencies [5cca3e1]
- Updated dependencies [9cf2160]
- Updated dependencies [04b8692]
- Updated dependencies [b8817b8]
- Updated dependencies [b3e73a5]
- Updated dependencies [ebf05cf]
- Updated dependencies [ef1c645]
- Updated dependencies [3562a94]
- Updated dependencies [b039dcb]
- Updated dependencies [26dd92a]
- Updated dependencies [abbe4af]
- Updated dependencies [b3e73a5]
- Updated dependencies [cbfa595]
- Updated dependencies [bc5f831]
- Updated dependencies [f904b71]
- Updated dependencies [56064fc]
- Updated dependencies [e8f4b07]
- Updated dependencies [412bbf2]
- Updated dependencies [cf1a829]
- Updated dependencies [8e193a3]
- Updated dependencies [0fa9b84]
- Updated dependencies [9cb98ee]
- Updated dependencies [7e97e18]
- Updated dependencies [44915b9]
- Updated dependencies [8ef9a56]
- Updated dependencies [23f393b]
- Updated dependencies [092e96e]
- Updated dependencies [a567f60]
- Updated dependencies [58a99bb]
- Updated dependencies [7e7a4aa]
- Updated dependencies [9c3f72e]
- Updated dependencies [1e39c70]
- Updated dependencies [0d210fe]
- Updated dependencies [c63817a]
- Updated dependencies [f20ec6c]
- Updated dependencies [0328fa3]
- Updated dependencies [e478c6b]
- Updated dependencies [4c48918]
- Updated dependencies [b4d1677]
- Updated dependencies [2a9f23d]
- Updated dependencies [678bb0b]
- Updated dependencies [8552e1b]
- Updated dependencies [52b0410]
- Updated dependencies [1450882]
- Updated dependencies [864e6de]
- Updated dependencies [c5de11c]
- Updated dependencies [b63ecc8]
    - @comet/cms-api@8.0.0

## 8.0.0-beta.6

### Patch Changes

- Updated dependencies [ef1c645]
- Updated dependencies [44915b9]
- Updated dependencies [c5de11c]
    - @comet/cms-api@8.0.0-beta.6

## 8.0.0-beta.5

### Minor Changes

- 9cf2160: API Generator: Add new option `single` to `@CrudGenerator` which allows to enable/disable the single query
- 7e89a91: Add input support for custom mikro-orm types, the `@Field` type must also be an `@InputType`
- 74c4fa7: Use the Entity Manager for all MikroORM operations
- ce6d3cd: Add basic support for inheritance used by entities
- d8c62ef: Add watch (`--watch`) and single file (`--file`) modes

### Patch Changes

- 4186bbb: Activate transpileOnly for better performance and fix enum issue we have with it
- e5b3b3d: Improve Performance: Don't format generated files with eslint anymore

    When scaffolding run eslint as first step.

- Updated dependencies [9cf2160]
- Updated dependencies [26dd92a]
- Updated dependencies [7e97e18]
- Updated dependencies [9c3f72e]
- Updated dependencies [c63817a]
- Updated dependencies [e478c6b]
- Updated dependencies [b63ecc8]
    - @comet/cms-api@8.0.0-beta.5

## 8.0.0-beta.4

### Major Changes

- 28d572b: Remove special `status` field behavior

### Minor Changes

- 0328fa3: API Generator: Add support for filtering `ID` fields

### Patch Changes

- Updated dependencies [b039dcb]
- Updated dependencies [412bbf2]
- Updated dependencies [0fa9b84]
- Updated dependencies [0328fa3]
    - @comet/cms-api@8.0.0-beta.4

## 8.0.0-beta.3

### Patch Changes

- @comet/cms-api@8.0.0-beta.3

## 8.0.0-beta.2

### Major Changes

- f904b71: Require Node v22

    The minimum required Node version is now v22.0.0.
    See the migration guide for instructions on how to upgrade your project.

### Patch Changes

- 0ee3e04: Exit without an error code when no entities are found
- Updated dependencies [f904b71]
- Updated dependencies [56064fc]
- Updated dependencies [23f393b]
- Updated dependencies [092e96e]
    - @comet/cms-api@8.0.0-beta.2

## 8.0.0-beta.1

### Patch Changes

- @comet/cms-api@8.0.0-beta.1

## 8.0.0-beta.0

### Major Changes

- 678bb0b: Move API Generator into separate `@comet/api-generator` package

    It can be run with the same `comet-api-generator` command as before.

### Patch Changes

- Updated dependencies [04b8692]
- Updated dependencies [b8817b8]
- Updated dependencies [3562a94]
- Updated dependencies [abbe4af]
- Updated dependencies [bc5f831]
- Updated dependencies [e8f4b07]
- Updated dependencies [cf1a829]
- Updated dependencies [9cb98ee]
- Updated dependencies [a567f60]
- Updated dependencies [58a99bb]
- Updated dependencies [7e7a4aa]
- Updated dependencies [0d210fe]
- Updated dependencies [f20ec6c]
- Updated dependencies [4c48918]
- Updated dependencies [678bb0b]
- Updated dependencies [8552e1b]
- Updated dependencies [52b0410]
    - @comet/cms-api@8.0.0-beta.0
