---
title: Grid Generator
sidebar_position: 1
id: grid-generator
---

# Grid Generator

The Grid Generator will create a DataGrid component with all defined options and columns.

## General Grid Options

Here is an overview of all general grid options. These affect the grid as a whole. Detailed explanations can be found below.

| Parameter           | Type                 | Required | Default     | Description                                                                                    |
| ------------------- | -------------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------- |
| `type`              | `"grid"` \| `"form"` | `true`   | `undefined` | When `"grid"` is set, the file is treated as a grid during generation.                         |
| `gqlType`           | `string`             | `true`   | `undefined` | The GraphQL object type to use for grid generation.                                            |
| `columns`           | `object[]`           | `true`   | `undefined` | Array of column definitions.                                                                   |
| `fragmentName`      | `string`             | `false`  | `undefined` | When set, uses this custom name for the GQL fragment names. Highly recommended.                |
| `query`             | `string`             | `false`  | `undefined` | When set, uses this query instead of the default list query of the `gqlType`.                  |
| `queryParamsPrefix` | `string`             | `false`  | `undefined` | When set, prefixes search and filter parameters in the URL with this string.                   |
| `add`               | `boolean`            | `false`  | `true`      | If `true`, includes the "add" operation in the row context menu.                               |
| `edit`              | `boolean`            | `false`  | `true`      | If `true`, includes the "edit" operation in the row context menu.                              |
| `delete`            | `boolean`            | `false`  | `true`      | If `true`, includes the "delete" operation in the row context menu.                            |
| `copyPaste`         | `boolean`            | `false`  | `true`      | If `true`, includes the "copyPaste" operation in the row context menu.                         |
| `readOnly`          | `boolean`            | `false`  | `false`     | If `true`, disables "add", "edit", "delete" and "copyPaste".                                   |
| `toolbar`           | `boolean`            | `false`  | `true`      | If `false`, no toolbar is generated. Toolbar options do not have any effect.                   |
| `toolbarActionProp` | `boolean`            | `false`  | `false`     | If `true`, a parameter to pass a custom toolbar action to the grid is generated.               |
| `newEntryText`      | `string`             | `false`  | `undefined` | If set, this string will be generated as the message in the main action button of the toolbar. |
| `excelExport`       | `boolean`            | `false`  | `false`     | If `true`, the "excelExport" option is included in "More Actions".                             |
| `filterProp`        | `boolean`            | `false`  | `false`     | If `true`, a parameter to pass a filter to the grid component is generated.                    |
| `rowActionProp`     | `boolean`            | `false`  | `false`     | If `true`, a parameter to pass a custom row action to the grid is generated.                   |
| `initialSort`       | `object[]`           | `false`  | `undefined` | When set, the grids columns are rendered with this preset sort.                                |
| `initialFilter`     | `object[]`           | `false`  | `undefined` | When set, the grid columns are rendered with this preset filter.                               |

### type

This option determines the type of generation. Set it to `"grid"` to generate a grid.

### gqlType

The GraphQL object type that will be displayed in the grid.

:::info
The GraphQL object type does not exist? Check the API logs for errors.
:::

### columns

`columns` contains all information for data that will be displayed in the grid.
They are generated in order of their definition.
All column types and options can be found [below](/docs/getting-started/crud-generator/admin-generator/grid-generator#general-column-options).

### fragmentName

When unset, the fragmentName is generated as `${GQLType}Grid`. Set this to prevent duplicate fragment names when generating multiple grids for the same GraphQL object type.
This is highly recommended, but not necessary for generation to function.

### query

When unset, the Admin Generator uses the default list query of the GraphQL object for the grid. `query` can be used to set a custom list query.

### queryParamsPrefix

Multiple grids on the same page without `queryParamsPrefix` will access the same filter and search parameters in the URL.
This can lead to errors and undesired behavior.
To prevent this, define a prefix for each grid to distinguish the parameter sets.

### excelExport

When `true`, the "excelExport" option is included in "More Actions". Default is `false`.

:::info
Currently, the `excelExport` option is always generated into "More Actions". To add it somewhere else in the toolbar pass it as a toolbarAction to the grid.
:::

### add

Determines whether the "add" operation is included in the row context menu. Default is `true`.

:::caution
This will be overridden when `readOnly` is set to `true`.
:::

### edit

Determines whether the "edit" operation is included in the row context menu. Default is `true`.

:::caution
This will be overridden when `readOnly` is set to `true`.
:::

### delete

Determines whether the "delete" operation is included in the row context menu. Default is `true`.

:::caution
This will be overridden when `readOnly` is set to `true`.
:::

### copyPaste

Determines whether the "copyPaste" operation is included in the row context menu. Default is `true`.

:::caution
This will be overridden when `readOnly` is set to `true`.
:::

### readOnly

When `true`, disables "add", "edit", "delete" and "copyPaste" operations in the row context menu regardless of their individual settings.
Default is `false`.

:::caution
Setting `readOnly` to `true` overrides other options.
:::

### toolbar

When set to `false`, no toolbar is generated.
This overrides all other toolbar related options such as `toolbarActionProp`, `excelExport`, or `newEntryText`.
Default is `true`.

:::caution
Setting `toolbar` to `false` overrides other options.
:::

### toolbarActionProp

When set to `true`, a parameter to pass a custom toolbar action to the grid is generated.

:::caution
This option will be overridden by the options `toolbar: false` or `add: false`.
:::

### newEntryText

Setting this implicitly enables the generation of a main action button that will link to a `StackPage` with pageName="add".
If set, this string will be generated as the message in the main action button of the toolbar.

:::caution
This option will be overridden by the options `toolbar: false` or `add: false`.
:::

### initialSort

This option sets an initial sort for grid columns. This sort can be overridden by the user via the grid column headers.
The array values are applied in order.

| Parameter | Type                | Required | Description                                         |
| --------- | ------------------- | -------- | --------------------------------------------------- |
| `field`   | `string`            | `true`   | The property of the GraphQL object type to sort by. |
| `sort`    | `"asc"` \| `"desc"` | `true`   | The column can be sorted ascending or descending.   |

Assume the used GraphQL object type has the properties `quantity` and `description`.
A grid with this `initialSort` configuration will list all entries by most `quantity`, then entries with the same `quantity` are sorted alphabetically by `description`.

```typescript
initialSort: [
    {field: "quantity", sort: "desc"},
    {field: "description", sort: "asc"},
],
```

### initialFilter

This option sets an initial filter for the grid. This filter can be overridden by the user via the filter panel.
The array values are applied in order.

| Parameter      | Type               | Required | Description                                                 |
| -------------- | ------------------ | -------- | ----------------------------------------------------------- |
| `items`        | `GridFilterItem[]` | `true`   | The filter definitions.                                     |
| `linkOperator` | `"and"` \| `"or"`  | `false`  | The operator to connect the conditions. Default is `"and"`. |

Assume the used GraphQL object type has the property `color`. Only the `color` values of `"green"` and `"red"` should be shown in the grid.
See the example for its use below.

```typescript
initialFilter: {
    items: [
        { columnField: "color", operatorValue: "is", value: "green" },
        { columnField: "color", operatorValue: "is", value: "red" },
    ],
    linkOperator: "or",
},
```

:::caution
The available filter operators depend on the defined column type. Using `"="` for a `string` value or `"is"` for a `number` value will lead to an error.
:::

### filterProp

Setting this to `true` generates a parameter to pass a fixed filter to the grid component. This filter does not show up in the filter panel and cannot be altered by the user.

:::caution
When a filter is passed as a parameter, it cannot be changed by the user. It is fixed and not visible in the filter panel.
:::

### rowActionProp

Setting this to `true` generates a parameter to pass a custom row action to the grid component.
It is generated into the `actions` column of the grid.

:::caution
This option can be overridden by the option `edit: false`.
:::

## General Column Options

Each column is defined within the `columns` array as an object.
For every column, the following general options can be set. Each column `type` may have its individual options in addition to these.
They can be found [below](/docs/getting-started/crud-generator/admin-generator/grid-generator#column-types).

| Type                | Type      | Required | Default             | Description                                                                         |
| ------------------- | --------- | -------- | ------------------- | ----------------------------------------------------------------------------------- |
| `type`              | `string`  | `true`   | `undefined`         | Define the type of values that is displayed in this column.                         |
| `name`              | `string`  | `true`   | `undefined`         | The name of the GraphQL object type property that will be displayed in the column.  |
| `headerName`        | `string`  | `false`  | The `name` property | Use this option to set a custom column header name. Translations can be added here. |
| `headerInfoTooltip` | `string`  | `false`  | `undefined`         | When set, shows the string as a tooltip on hover over the column header.            |
| `width`             | `number`  | `false`  | 150                 | Set the width of the column.                                                        |
| `minWidth`          | `number`  | `false`  | 150                 | Set the minimum width of the column.                                                |
| `maxWidth`          | `number`  | `false`  | `undefined`         | Set the maximum width of the column.                                                |
| `flex`              | `number`  | `false`  | 1                   | Set the flex parameter of the column.                                               |
| `pinned`            | `object`  | `false`  | `undefined`         | Define columns as pinned to the left or right side of the grid.                     |
| `disableExport`     | `boolean` | `false`  | `false`             | If `true`, exclude this column when generating an excel export.                     |
| `visible`           | `string`  | `false`  | `undefined`         | Define a column to be visible up or down from a specific breakpoint.                |
| `fieldName`         | `string`  | `false`  | `undefined`         | Used to override naming for nested values when needed.                              |
| `filterOperators`   | `object`  | `false`  | `undefined`         | Import custom filter operators for this column.                                     |

:::info
Every column object requires the `type` and `name` options to be generated. Leaving them out will result in an error.
:::

### type

This determines how the column values are treated for display. See the list of available types [below](/docs/getting-started/crud-generator/admin-generator/grid-generator#column-types).

### name

The `name` determines the GraphQL object type property that will be shown in that column.

### headerName

Use this option to set a custom column header name. Default is the `name` property.
Translations can be defined here:

```typescript
{
    type: "text",
    name: "description",
    headerName: "Description",
    //...
},
```

### headerInfoTooltip

When set, shows the `headerInfoTooltip` string as a tooltip on hover over the column header.

### fieldName

`fieldName` is used to override the `name` property. This is needed in some cases when accessing nested values in referenced entities.
Nested values are defined like this:

```typescript
{
    type: "number",
    name: "price.value",
    //...
},
```

During generation, `"price.value"` will be transformed to `"price_value"`.
If this is not the needed naming for the API, use `fieldName` to manually set it.

### width

Set the width of the column. Default is `150`.

### minWidth

Set the minimum width of the column. Default is `150`.

### maxWidth

Set the maximum width of the column. Default is `undefined`.

### flex

Set the flex parameter of the column. Default is `1`.

### pinned

Columns can be pinned to the left or right side of a grid.
To do so, add the GraphQL object type property name to either the `left` or `right` array in the `pinned` object.
The pinned columns can be updated by the user via the column header context menu.

Here is an example: The `description` column is pinned to the left side, and the `quantity` and `color` columns are pinned to the right side.

```typescript
pinned: {
    left: [ "description" ],
    right: [ "quantity", "color" ],
},
```

### disableExport

Set this to `true`, if the column should be excluded from the Excel export. Default is `false`.

### visible

This setting is used to set the visibility of columns. It is useful especially for mobile optimizations.

Columns can be defined as visible up to, down from, only for, only not for or between specific breakpoints.

The values are defined in this structure: `"direction('breakpoint')"`.

| Parameter    | Available values                               |
| ------------ | ---------------------------------------------- |
| `direction`  | `down` \| `up` \| `only` \| `not` \| `between` |
| `breakpoint` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` |

A column defined with:

```typescript
visible: "down('md')",
```

will be visible up to the medium breakpoint. Above that it is hidden.
The column can still be accessed and set to be visible by the user via the column header context menu.

A column defined as:

```typescript
visible: "between('sm', 'lg)",
```

will be visible for the breakpoints `sm`, `md`, and `lg`.
Above and below them the column is hidden.
It can still be accessed and set to be visible by the user via the column header context menu.

### filterOperators

`filterOperators` can be used to import custom filters for a column.
They need to be of type `GridFilterOperator` to be usable.

The reference is defined like this:
`name` is the name of the exported filter component in the file referenced by the path in `import`.

```typescript
filterOperators: { name: "CustomFilter", import: "./CustomFilterOperators" },
```

:::info
An example for custom filter operations can be found [here](https://github.com/vivid-planet/comet/blob/main/demo/admin/src/products/future/ProductsGrid.cometGen.ts#L105) in the Comet Demo project.
:::

## Column Types

Each column is defined by an object that requires at least these two properties: `type`, `name`.
Each column amy have additional individual options.

| Type           | Description                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `text`         | For `string` based columns. Also used for `asyncSelect` values.                                  |
| `number`       | For `number` based columns.                                                                      |
| `boolean`      | For `boolean` based columns. Renders X and checkmark icons.                                      |
| `date`         | For `date` based columns.                                                                        |
| `dateTime`     | For `dateTime` based columns.                                                                    |
| `staticSelect` | For `staticSelect` based columns.                                                                |
| `block`        | Renders a small preview of the block.                                                            |
| `combination`  | A versatile column for combined and nested values.                                               |
| `actions`      | The row context menu is generated into the actions column. Custom row actions can be added here. |

### text

This column type is used for simple `string` based values. The value is displayed as is, with text alignment to the left.

There are no further type specific options.

:::info

-   There is no `string` column type. Always use `text` for `string` values.
-   `asyncSelect` fields of forms correspond to `text` columns in grids.
-   Further formatting of `text` values can be done by using the `combination` column type.

:::

### number

This column type is used for simple `number` based values. The value is displayed as is, with text alignment to the right.

There are no further type specific options.

:::info
Further formatting of `number` values, like currency formatting, can be done by using the `combination` column type.
:::

### boolean

`boolean` values are generated as X and checkmark icons. There is no third undefined value for columns.

There are no further type specific options.

### date

`date` columns are displayed in the format of the current browser locale.
To force a specific date format, change it to string in the API Generator and use a `@ResolveField` to format the date.

There are no further type specific options.

### dateTime

`dateTime` columns are displayed in the format of the current browser locale.
To force a specific date format, change it to string in the API Generator and use a `@ResolveField` to format the date.

There are no further type specific options.

### staticSelect

`staticSelect` values can be defined in varying degrees of detail: Just the values, values with a translatable label, or values with a label and icon.
The minimum definition looks like this:

```typescript
{
    type: "staticSelect",
    //...
    values: [ "red","blue", "green" ],
},
```

If you wish to translate your values, you can define them with a label.
Per default, the `name` property is used as the label.
Secondary text can be added as well. It is displayed in a second line below.

```typescript
{
    type: "staticSelect",
    //...
    values: [
        "red",
        { value: "blue", label: "Blue" },
        { value: "green", label: { primaryText: "Green", secondaryText: "Hex: #00ff00" } },
    ],
},
```

:::caution
Make sure to use identical values for a property across grids and forms with the same GraphQL object type.
Translated values are generated as `FormattedMessage`s and they will conflict in the generated `defaultMessages`s otherwise.
:::

Icons can be defined in multiple ways: Just the icon name, an icon object or an import reference.
All icons from Comet can be used this way. If you need a custom icon, use an import reference.
The available colors are all the supported theme colors.

```typescript
{
    type: "staticSelect",
    //...
    values: [
        {
            value: "blue",
            label: { primaryText: "Blue", icon: "StateFilled", color: "info" } // icon name
        },
        {
            value: "green",
            label: {
                primaryText: "Green",
                icon: { name: "StateFilled", color: "success" } // icon object
            },
        },
        { value: "red",
            label: {
                primaryText: "Red",
                icon: {
                    name: "CustomIcon",
                    import: "./CustomIconFile",
                    color: "error",
                },  // import reference
            },
        },
    ],
},
```

### block

Blocks are defined with an import reference to the block component:

```typescript
{
    type: "block",
    name: "image",
    //...
    block: { name: "DamImageBlock", import: "@comet/cms-admin" },
},
```

There are no further type specific options.

### combination

The `combination` column type is very powerful.
It can be used to combine multiple values of different GraphQL object type properties into one column.
Fields in this column can be nested and adapted with custom text and formatting.

:::info
A list of examples can be viewed [here](https://github.com/vivid-planet/comet/blob/main/demo/admin/src/products/future/CombinationFieldsTestProductsGrid.cometGen.ts) in the Comet Demo project.
:::

:::caution
The `combination` column is not yet supported in the Excel export. Using it with an export will lead to an error.
:::

### actions

This column contains the row context menu as well as custom components passed in via the `rowAction` prop.
Additionally, a component can be passed here in the config file like this:

```typescript
{
    type: "actions",
    component: { name: "CustomAction", import: "./CustomAction" },
},
```
