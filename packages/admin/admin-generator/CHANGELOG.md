# @comet/admin-generator

## 8.4.2

## 8.4.1

## 8.4.0

### Minor Changes

- 52f56b9: asyncSelect: add support for autocomplete, defaulting to true if rootQuery has a search argument [breaking]

## 8.3.0

### Minor Changes

- 3f832dd: Remove virtual setting from form config
- 00dd172: Support filtering asyncSelectFilter to allow multiple levels of filtered selects
- dbd83d6: Use `Future_DatePickerField` instead of `FinalFormDatePicker`
- 5ba61ab: Add form field type asyncSelectFilter that can be used to filter an asyncSelect
- f49b3c3: Use `Future_DateTimePickerField` instead of `DateTimePickerField`
- 4a65444: staticSelect/asyncSelect: add support for multiple (array) values, autodetects LIST fields in GraphQL schema

### Patch Changes

- ba0c023: Fix generating column for nested date field
- ebc6fff: Form Generation: `StaticSelect` with `inputType: "select"` now generates `SelectField` instead of `Field` + `FinalFormSelect`.
- fb9b950: Fix sending null for date field
- 512bd43: Fix selection for `selectionProps` `"singleSelect"`: set `disableRowSelectionOnClick` to `false`

## 8.2.0

### Minor Changes

- 67c52d5: Admin Generator: support export boolean column as real boolean column
- ef669d4: **Breaking:** Rename `filter.gqlName` to `filter.rootQueryArg` and `filter.fieldName` to `filter.formFieldName` for `asyncSelect` form fields

    This is done to better reflect what the options are used for.
    To upgrade, rename the fields in your Admin Generator configs:

    ```diff
    {
        fields: [
            {
                type: "asyncSelect",
                name: "manufacturer",
                rootQuery: "manufacturers",
                filter: {
                    type: "typeField",
    -               fieldName: "manufacturerCountry",
    +               formFieldName: "manufacturerCountry",
    -               gqlName: "addressAsEmbeddable_country",
    +               rootQueryArg: "addressAsEmbeddable_country",
                },
            },
        ];
    }
    ```

- 7f066d1: Admin Generator: Allow fetching additional fields for action columns

## 8.1.1

## 8.1.0

### Patch Changes

- 2fa023d: Fix disabling row selection on click
- 76586dc: Fix generated `ToolbarProps` for `excelExport`-only case

    When generating `ToolbarProps` with `forwardToolbarAction = false` and `excelExport = true`, the generator previously inserted `false` into the generated interface, causing invalid TypeScript output.

    **Example broken output**

    ```ts
    interface BooksGridToolbarToolbarProps extends GridToolbarProps {
        false;
        exportApi: ExportApi;
    }
    ```

- 00e7400: Fix generating too many props for grid-component

    This happened if there was a required root gql-arg for the corresponding create-mutation to support copy/paste.

- 177cb58: Fix missing required root gql-arg for export-query
- dc69279: Admin-Generator: Fix missing readOnly props for async-select
- ded0cbc: Admin-Generator: Fix using wrong query-var for export

## 8.0.0

### Major Changes

- f904b71: Require Node v22

    The minimum required Node version is now v22.0.0.
    See the migration guide for instructions on how to upgrade your project.

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

- 584f785: Move Admin Generator into separate `@comet/admin-generator` package.

    It can be run with the same `comet-admin-generator` command as before.

## 8.0.0-beta.6

## 8.0.0-beta.5

## 8.0.0-beta.4

## 8.0.0-beta.3

## 8.0.0-beta.2

### Major Changes

- f904b71: Require Node v22

    The minimum required Node version is now v22.0.0.
    See the migration guide for instructions on how to upgrade your project.

## 8.0.0-beta.1

## 8.0.0-beta.0

### Major Changes

- 584f785: Move Admin Generator into separate `@comet/admin-generator` package.

    It can be run with the same `comet-admin-generator` command as before.
