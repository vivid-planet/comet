---
title: Admin Generator
sidebar_position: 2
---

The Admin Generator can be used to generate grid and form components based on GraphQL object types.

Contrary to the API Generator, the Admin Generator does not use Decorators to define its options.
The configuration is done in its own config file.

:::info
Many example configs can be found in the [Comet Demo](https://github.com/vivid-planet/comet/tree/main/demo/admin/src) project.
:::

## The Generation File

The generator finds files based on the `.cometGen.ts` file ending. A file with another ending will not be recognized.
The name of the config file determines the name of the generated file.
The name of the configuration component determines the name of the generated component.

:::caution
Take care when creating a new config file. A file with the ending `.cometGen.tsx` will not generate.
:::

### Configuration of a Form

To generate a form, a configuration object with the `FormConfig<GQLType>` type is needed.
Form fields are defined in the `fields` array, next to all general options.
A detailed description of all available options can be found [here](/docs/getting-started/crud-generator/admin-generator/form-generator).

```typescript
export const ProductForm: FormConfig<GQLProduct> = {
    type: "form",
    gqlType: "Product",
    // general options
    fields: [
        {
            // field definition
        },
    ],
};
```

### Configuration of a Grid

To generate a grid, a configuration object with the `GridConfig<GQLType>` type is needed.
Grid columns are defined in the `columns` array, next to all general options.
A detailed description of all available options can be found [here](/docs/getting-started/crud-generator/admin-generator/grid-generator).

```typescript
export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    // general options
    columns: [
        {
            // column definition
        },
    ],
};
```

:::info
The minimum requirements to generate a grid or form are the `type` and `gqlType` options and at least one `field` or `column`.
:::

### Configuration of Tabs

The Admin Generator supports generating tabs around grids and forms, as they are often used together.
To do so, the configurations are wrapped in a `TabsConfig` object.

```typescript
export const TabsExample: TabsConfig = {
    type: "tabs",
    tabs: [
        {
            name: "Details",
            content: {
                type: "form",
                gqlType: "Product",
                // other general options
                fields: [
                    {
                        // field definitions
                    },
                ],
            },
        },
        {
            name: "General",
            content: ProductsGrid,
        },
    ],
};

const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    // other general options
    columns: [
        {
            // column definitions
        },
    ],
};
```

### Page Generator

Coming soon.

## Run the Generator

After creating a config file, it can be generated. Newer projects should already have an
`admin-generator` npm script.
If it's still missing, it can be added to `admin/package.json`:

```json title="admin/package.json"
{
    //...
    "scripts": {
        "admin-generator": "rimraf 'src/*/generated' && comet-admin-generator generate crud-generator-config.ts && comet-admin-generator future-generate"
        //...
    }
    //...
}
```

Now, the files can be generated with the following command:

```bash
npm run admin-generator
```

The generated files are created in a directory named `generated` in the same directory as the config files are.
See an example below:

```ts title="File Structure"
/products
|---/generated
|   |---ProductForm.gql.tsx
|   |---ProductForm.tsx
|   |---ProductsGrid.tsx
|---ProductForm.cometGen.ts
|---ProductsGrid.cometGen.ts
```

:::info
Although this is generated code, it needs to be checked into the repository. The pages that use the components depend on them.
:::

## Field And Column Compatibility

Data from a form will be displayed in a grid, and grid entries need to be edited.
However, not all form field types can be displayed in a grid and vice versa.
Following is a table of all field and column types with their type match:

| Grid Column Type | Form Field Type | Notes                                                                     |
| ---------------- | --------------- | ------------------------------------------------------------------------- |
| `text`           | `text`          |                                                                           |
| `number`         | `number`        |                                                                           |
| `combination`    | `numberRange`   | To display two number values, use the `combination` column.               |
| `date`           | `date`          |                                                                           |
| `dateTime`       | `dateTime`      |                                                                           |
| `boolean`        | `boolean`       |                                                                           |
| `staticSelect`   | `staticSelect`  |                                                                           |
| `block`          | `block`         |                                                                           |
| `combination`    | none            | `combination` values are custom. No single form field can represent this. |
| `action`         | none            | This grid column contains the context menu and other action buttons.      |
| `text`           | `asyncSelect`   | Form `asyncSelect` values are rendered as `text` in grids.                |
| none             | `fileUpload`    | `fileUploads` cannot be displayed in grids at the moment.                 |
