# @comet/api-generator

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
