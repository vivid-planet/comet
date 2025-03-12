---
title: Form Generator
sidebar_position: 2
id: form-generator
---

# Form Generator

The Grid Generator will create a form with all defined options and fields.

## General Form Options

Here is an overview of all general form options. These affect the form as a whole. Detailed explanations can be found below.

| Parameter        | Type                           | Required | Default     | Description                                                                     |
| ---------------- | ------------------------------ | -------- | ----------- | ------------------------------------------------------------------------------- |
| `type`           | `"grid"` \| `"form"`           | `true`   | `undefined` | When `"form"` is set, the file is treated as a form during generation.          |
| `gqlType`        | `string`                       | `true`   | `undefined` | The GraphQL object type to use for form generation.                             |
| `fields`         | `object[]`                     | `true`   | `undefined` | Array of field definitions.                                                     |
| `mode`           | `"add"` \| `"edit"` \| `"all"` | `false`  | `"all"`     | When set, allows these functions. Default is `"all"`.                           |
| `fragmentName`   | `string`                       | `false`  | `undefined` | When set, uses this custom name for the GQL fragment names. Highly recommended. |
| `createMutation` | `string`                       | `false`  | `undefined` | When set, uses this query instead of the default create query of the `gqlType`. |

### type

This option determines the type of generation. Set it to `"form"` to generate a form.

### gqlType

The GraphQL object type that will be displayed in the form.

:::info
The GraphQL object type does not exist? Check the API logs for errors.
:::

### fields

`fields` contains all information for form fields that will be displayed.
They are generated in order of their definition.
All field types and options can be found [below](/docs/getting-started/crud-generator/admin-generator/form-generator#general-field-options).

### mode

This option determines what kind of actions the form will support.
If only an "edit" form is needed, set it to `"edit"`.
If only an "add" form is needed, set it to `"add"`.
The default is `"all"`, meaning both `"edit"` and `"add"` will be available in the generated form.

### fragmentName

When unset, the fragmentName is generated as `${GQLType}Form`. Set this to prevent duplicate fragment names when generating multiple forms for the same GraphQL object type.
This is highly recommended, but not necessary for generation to function.

### createMutation

When unset, the Admin Generator uses the default create mutation of the GraphQL object type for the form. `createMutation` can be used to set a custom list query.

## General Field Options

| Parameter    | Type      | Required | Default             | Description                                                                     |
| ------------ | --------- | -------- | ------------------- | ------------------------------------------------------------------------------- |
| `type`       | `string`  | `true`   | `undefined`         | Define the type of value that is entered in this field.                         |
| `name`       | `string`  | `true`   | `undefined`         | The name of the GraphQL object type property that will be edited in this field. |
| `label`      | `string`  | `false`  | The `name` property | Set a custom field label. Translations can be added here.                       |
| `required`   | `boolean` | `false`  | `false`             | If `true`, the field is generated as `required`.                                |
| `virtual`    | `boolean` | `false`  | `false`             | If `true`, the field value will not be persisted.                               |
| `validate`   | `object`  | `false`  | `undefined`         | Set custom validation here.                                                     |
| `helperText` | `string`  | `false`  | `undefined`         | Set a `helperText` that is displayed below the input field.                     |
| `readOnly`   | `boolean` | `false`  | `false`             | If `true`, the field is not editable.                                           |

### type

This determines what kind of field is generated. See the list of available types [below](/docs/getting-started/crud-generator/admin-generator/form-generator#field-types).

### name

The `name` determines the GraphQL object type property that will be shown in that field.

### label

Use this option to set a custom field label. Default is the `name` property.
Translations can be defined here:

```typescript
{
    type: "text",
    name: "description",
    label: "Description",
    //...
},
```

### required

If `true`, the field is generated as `required`.

### virtual

If `true`, the field value will not be persisted. This field only exists in the form state and not in the API.

A `virtual` field can be used as a filter for an `asyncSelect` field for example.

### validate

Via the `validate` option, custom validation can be set. It can be passed as an import reference like this:
`name` is the name of the exported filter component in the file referenced by the path in `import`.

```typescript
{
    type: "number",
    name: "price",
    validate: {name: "PriceValidation", import: "./PriceValidation"},
    //...
},
```

### helperText

Set a `helperText` that is displayed below the input field.

### readOnly

If `true`, the field is not editable.

## Field Types

| Type                   | Adornment Support | Description                                                                                  |
| ---------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| `text`                 | `true`            | For `string` based values.                                                                   |
| `number`               | `true`            | For `number` based values.                                                                   |
| `numberRange`          | `true`            | For `number` range values. Minimum and maximum values are required.                          |
| `boolean`              | `false`           | For `boolean` based values. Renders a switch.                                                |
| `date`                 | `true`            | For `date` values. Renders a date picker field.                                              |
| `dateTime`             | `true`            | For `dateTime` values. Renders a date and time picker field.                                 |
| `staticSelect`         | `true`            | For a selection of fixed values. Often used for enum values.                                 |
| `asyncSelect`          | `true`            | For a selection of loaded values. Often used for references to other entities.               |
| `block`                | `false`           | Add a block. Defined with an import reference.                                               |
| `fileUpload`           | `false`           | To upload a file. Supports multi-file upload.                                                |
| `fieldSet`             | `false`           | Wraps fields with a collapsible. Within this, all field types except `fieldSet` can be used. |
| `component`            | `false`           | Add an arbitrary component. Defined with an import reference.                                |
| `optionalNestedFields` | `false`           | Show or hide a set of optional fields. They need to be combined as one type.                 |

### text

This field supports `text` input.
It supports `multiline` input.

```typescript
{
    type: "text",
    name: "description",
    multiline: true,
},
```

### number

This field supports `number` input.

### numberRange

This field generates two number inputs for a range.
When adding an adornment to this field, both fields will have the adornment.
The field requires a set minimum and maximum value.

| Parameter       | Type      | Required | Description                                                                           |
| --------------- | --------- | -------- | ------------------------------------------------------------------------------------- |
| `minValue`      | `number`  | `true`   | The minimum settable value of the range.                                              |
| `maxValue`      | `number`  | `true`   | The maximum settable value of the range.                                              |
| `disableSlider` | `boolean` | `false`  | When `false` disables the slider to select the min and max values. Default is `true`. |

```typescript
{
    type: "numberRange",
    name: "price",
    min: 1,
    max: 100,
    disableSlider: true,
},
```

### boolean

`boolean` fields are generated as sliders.

There are no further type specific options.

### date

A `DatePicker` field is generated.

There are no further type specific options.

### dateTime

A `DateTimePicker` field is generated.
When adding an adornment to this field, both fields will have the adornment.

There are no further type specific options.

### staticSelect

`staticSelect` fields can be generated in two different styles: As radio buttons or as a select field.
The default behavior is to use radio buttons for equal or less than 5 values and a select field for more than 5 values.
This can be overridden by setting the `inputType` option to `radio` or `select`.

```typescript
{
    type: "staticSelect",
    name: "color",
    inputType: "select",
    values: [
        "red",
        { value: "blue", label: "Blue" },
        { value: "green", label: "Green" },
    ],
},
```

The values can be defined in varying degrees of detail:
Just the values, values with a translatable label, or values with a label and icon.
Per default, the `name` property is used as the label.

:::info
Contrary to `staticSelect` in grids, form `staticSelect` values do not support icons.
:::

### asyncSelect

`asyncSelect` fields are used for selecting values from a list of loaded values.
This field currently supports only object values, meaning fields that are references to other entities.

Following is the list of `asyncSelect` specific options:

| Parameter     | Type                               | Required | Description                                       |
| ------------- | ---------------------------------- | -------- | ------------------------------------------------- |
| `rootQuery`   | `string`                           | `true`   | The `query` that will be used to load the values. |
| `labelField`  | `string`                           | `false`  | The property to be shown in the field.            |
| `filterField` | `{name: string, gqlName?: string}` | `false`  | Used to filter the available values.              |

#### rootQuery

This query will be used to load the values for the field.

#### labelField

`labelField` specifies the property of the referenced entity that will be displayed in the select field.

If no `labelField` is provided, the generator tries to find `string` properties named `name` or `title`.
If that is unsuccessful, the first `string` field, if found, is used.
When no field is found, the Generator will error.

#### filterField

`asyncSelect` field values can be filtered with `filterField`.
`name` and `gqlName` are searched for as properties in the `rootQuery`.
If found, that field is used to filter.

If they are not found, the Generator tries to find them as filter arguments in the `rootQuery`.
When `gqlName` is set, then the variable is generated as an explicit filter.
If only `name` is set, then the variable is generated as a filter argument.

#### Examples

A field definition like this:

```typescript
{
    type: "asyncSelect",
    name: "category",
    rootQuery: "productCategories",
    //...
},
```

will generate a field with a query like this:

```typescript jsx
<AsyncSelectField
    //...
    loadOptions={async () => {
        const { data } = await client.query<
            GQLProductCategoriesSelectQuery,
            GQLProductCategoriesSelectQueryVariables
        >({
            query: gql`
                query ProductCategoriesSelect {
                    productCategories {
                        nodes {
                            id
                            title
                        }
                    }
                }
            `,
        });
        return data.productCategories.nodes;
    }}
/>
```

As the `filterField` is unset, only the defined `rootQuery` without arguments is generated.

Assume a `Product` entity has a `type` field and a `Manufacturer` entity has an embeddable `address` field.
The country of that `address` will be the content of the select field.
The following example filters the available `Manufacturer.address` values by the `Product.type` field.

```typescript
{
    type: "asyncSelect",
    name: "manufacturer",
    rootQuery: "manufacturers",
    filterField: {
        name: "type",
        gqlName: "addressAsEmbeddable_country",
    },
    //...
},
```

will generate a field with a query looking like this:

```typescript jsx
<AsyncSelectField
    //...
    loadOptions={async () => {
        const { data } = await client.query<GQLManufacturersSelectQuery, GQLManufacturersSelectQueryVariables>({
            query: gql`
                    query ManufacturersSelect($filter: ManufacturerFilter) {
                        manufacturers(filter: $filter) {
                            nodes {
                                id
                                name
                            }
                        }
                    }
                `,
            variables: { filter: { addressAsEmbeddable_country: { equal: values.type } } },
        });
    return data.manufacturers.nodes;
    }}
/>
<OnChangeField name="type">
    {(value, previousValue) => {
        if (value.id !== previousValue.id) {
            form.change("manufacturer", undefined);
        }
    }}
</OnChangeField>
```

As the `gqlName` is set, the field is generated as an explicit filter.
The `<OnChangeField>` component is generated to reset the `manufacturer` field when the `type` field changes.

These examples can be found [here](https://github.com/vivid-planet/comet/blob/main/demo/admin/src/products/future/ProductForm.cometGen.ts#L58) in the Demo project.

:::info
Options to use other property types and different uses of queries and filters will be added in the future.
:::

### block

Block fields are defined with an import reference to the block component:

```typescript
{
    type: "block",
    name: "image",
    label: "Image",
    block: { name: "DamImageBlock", import: "@comet/cms-admin" },
},
```

### fileUpload

`fileUpload` fields can be used to upload one or more files.

Following is a list of all `fileUpload` options:

| Parameter     | Type      | Required | Default     | Description                                                                                                 |
| ------------- | --------- | -------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `name`        | `string`  | `true`   | `undefined` | The `name` of the corresponding entity property.                                                            |
| `label`       | `string`  | `false`  | `undefined` | The `label` to be shown for the field.                                                                      |
| `maxFileSize` | `number`  | `false`  | `undefined` | The maximum file size in Bytes. If `undefined`, there is no limit.                                          |
| `multiple`    | `boolean` | `false`  | `false`     | If `true`, allows to upload multiple files in one field.                                                    |
| `maxFiles`    | `number`  | `false`  | `undefined` | The maximum number of files to be uploaded in this field. This is overridden to 1 if `multiple` is `false`. |
| `download`    | `boolean` | `false`  | `false`     | If `true`, allows to download the file or files.                                                            |

### fieldSet

A `fieldSet` is used to wrap form fields to create a collapsible section.

Following is a list of all `fieldSet` options:

| Parameter           | Type       | Required | Default     | Description                                                                                                                   |
| ------------------- | ---------- | -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `name`              | `string`   | `true`   | `undefined` | The `string` that will prefix all generated `FormattedMessage` `id`s. Will be displayed as header title if no `title` is set. |
| `title`             | `string`   | `false`  | `undefined` | The `title` that is displayed in the header of the `fieldSet`. Overrides the `name`.                                          |
| `supportText`       | `string`   | `false`  | `undefined` | A subtitle that is shown below the `title`.                                                                                   |
| `collapsible`       | `boolean`  | `false`  | `true`      | If `true`, allows the `fieldSet` to be collapsed.                                                                             |
| `initiallyExpanded` | `boolean`  | `false`  | `false`     | If `true`, the `fieldSet` will be initially expanded.                                                                         |
| `fields`            | `object[]` | `true`   | `undefined` | The list of fields that are within the `fieldSet`. Defined like any other form fields.                                        |

:::caution
`fieldSet`s cannot be nested within each other. This will result in an error.
:::

### component

Arbitrary components can be used in forms as well. They are defined with an import reference:

```typescript
{
    type: "component",
    component: { name: "FutureProductNotice", import: "../../helpers/FutureProductNotice" },
},
```

### optionalNestedFields

Some optional fields are rarely needed.
With `optionalNestedFields`, these can be hidden behind a switch to reduce visual clutter.
However, all fields within `optionalNestedFields` must be combined into one type in the API.

A field defined like this:

```typescript
{
    type: "optionalNestedFields",
    name: "dimensions",
    checkboxLabel: "Configure dimensions",
    fields: [
        { type: "number", name: "width", label: "Width" },
        { type: "number", name: "height", label: "Height" },
        { type: "number", name: "depth", label: "Depth" },
    ],
},
```

has `width`, `height` and `depth` combined into one type in the entities property definition. See the example in the entity [here](https://github.com/vivid-planet/comet/blob/main/demo/api/src/products/entities/product.entity.ts#L162).

:::caution

-   Only optional fields work in this section. `required` or `component` fields will lead to an error.
-   `optionalNestedFields` cannot be nested within each other. This will result in an error.

:::

Following is a list of all `optionalNestedFields` options:

| Parameter       | Type       | Required | Default     | Description                                                                                                 |
| --------------- | ---------- | -------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `name`          | `string`   | `true`   | `undefined` | `name` of the object containing all the optional fields. Will be used as label for the switch.              |
| `checkBoxLabel` | `string`   | `false`  | `undefined` | If set, overrides the `name` and is used as label for the switch.                                           |
| `fields`        | `object[]` | `true`   | `undefined` | The list of fields that are within the `optionalNestedFields`. They are defined like any other form fields. |

## Setting Adornments

Most fields support start and end adornments. These can be used to add icons to the beginning or end of the input fields.
Support is noted in the overview and description of each field type.

Icons can be defined in multiple ways: As just a `string`, an icon name, an icon object or an import reference.
All icons from Comet can be used this way. If you need a custom icon, use an import reference.
The available colors are all the supported theme colors.

See the examples below:

```typescript
//...
{
    type: "numberRange",
    name: "priceRange",
    minValue: 1,
    maxValue: 100,
    startAdornment: "€", // string
},
{ type: "date", name: "availableSince", endAdornment: { icon: "CalendarToday" } }, // icon name
{ type: "dateTime", name: "purchaseDateTime", startAdornment: { icon: { name: "CalendarToday" }  } }, // icon object
{
    type: "staticSelect", name: "productType",
    endAdornment: {
        icon: {
            name: "CustomIcon",
            import: "./CustomIconFile",
        }, // import reference
    },
},
//...
```
