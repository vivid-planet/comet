---
title: Form Generator
sidebar_position: 2
id: form-generator
---

# Form Generator

The Grid Generator will create a form with all defined options and fields.

## General Form Options

Here is an overview of all general form options. These affect the form as a whole. Detailed explanations can be found below.

| Parameter        | Type                             | Required | Default     | Description                                                                     |
| ---------------- | -------------------------------- | -------- | ----------- |---------------------------------------------------------------------------------|
| `type`           | `"grid"` \| `"form"` \| `"tabs"` | `true`   | `undefined` | When `"form"` is set, the file is treated as a form during generation.          |
| `gqlType`        | `string`                         | `true`   | `undefined` | The `GQLType` to use for form generation.                                       |
| `fields`         | `object[]`                       | `true`   | `undefined` | Array of field definitions.                                                     |
| `mode`           | `"add"` \| `"edit"` \| `"all"`   | `false`  | `undefined` | When set, allows these functions. Default is `"all"`.                           |
| `fragmentName`   | `string`                         | `false`  | `undefined` | When set, uses this custom name for the GQL fragment names. Highly recommended. |
| `createMutation` | `string`                         | `false`  | `undefined` | When set, uses this query instead of the default create query of the `GQLType`. |

### type

This option determines the type of generation. Set it to `"form"` to generate a form.

### gqlType

The `GQLType` that will be displayed in the grid.

:::info
The `GQLType` does not exist? Check the API logs for errors.
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

When unset, the fragmentName is generated as `${GQLType}Form`. Set this to prevent duplicate fragment names when generating multiple forms for the same `GQLType`.
This is highly recommended, but not necessary for generation to function.

### createMutation

When unset, the Admin Generator uses the default create mutation of the `GQLType` for the form. `createMutation` can be used to set a custom list query.

## General Field Options

| Parameter    | Type      | Required | Default              | Description                                                           |
| ------------ | --------- | -------- |----------------------|-----------------------------------------------------------------------|
| `type`       | `string`  | `true`   | `undefined`          | Define the type of value that is entered in this field.               |
| `name`       | `string`  | `true`   | `undefined`          | The name of the `GQLType` property that will be edited in this field. |
| `label`      | `string`  | `false`  | The `name` property  | Set a custom field label. Translations can be added here.             |
| `required`   | `boolean` | `false`  | `false`              | If `true`, the field is generated as `required`.                      |
| `virtual`    | `boolean` | `false`  | `false`              | If `true`, the field value will not be persisted.                     |
| `validate`   | `object`  | `false`  | `undefined`          | Set custom validation here.                                           |
| `helperText` | `string`  | `false`  | `undefined`          | Set a `helperText` that is displayed below the input field.           |
| `readOnly`   | `boolean` | `false`  | `false`              | If `true`, the field is not editable.                                 |

### type

This determines what kind of field is generated. See the list of available types [below](/docs/getting-started/crud-generator/admin-generator/form-generator#field-types).

### name

The `name` determines the `GQLType` property that will be shown in that field.

### label

Use this option to set a custom field label. Default is the `name` property.
Translations can be defined here:

```typescript
{
    type: "text",
    name: "description",
    label: "Beschreibung",
    //...
},
```

### required

If `true`, the field is generated as `required`.

### virtual

<font color="red">TODO More Info. why, use case</font>

If `true`, the field value will not be persisted. 

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
|------------------------|-------------------|----------------------------------------------------------------------------------------------|
| `text`                 | `true`            | For `string` based values.                                                                   |
| `number`               | `true`            | For `number` based values.                                                                   |
| `numberRange`          | `true`            | For `number` range values. Minimum and maximum values are required.                          |
| `boolean`              | `false`           | For `boolean` based values. Renders a switch.                                                |
| `date`                 | `true`            | For `date` values.                                                                           |
| `dateTime`             | `true`            | For `dateTime` values. Renders a date and time picker field.                                 |
| `staticSelect`         | `true`            | For a selection of fixed values. Often used for enum values.                                 |
| `asyncSelect`          | `true`            | For a selection of loaded values. Often used for references to other entities.               |
| `block`                | `false`           | <font color="red">TODO</font>                                                                |
| `fileUpload`           | `false`           | To upload a file. Supports multi-file upload.                                                |
| `fieldSet`             | `false`           | Wraps fields with a collapsible. Within this, all field types except `fieldSet` can be used. |
| `component`            | `false`           | A<font color="red">TODO</font>                                                               |
| `optionalNestedFields` | `false`           | <font color="red">TODO</font>                                                                |

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
The default behaviour is to use radio buttons for equal or less than 5 values and a select field (dropdown) for more than 5 values.
This can be overridden by setting the `inputType` option to `radio` or `select`.

```typescript
{
    type: "staticSelect",
    name: "color",
    inputType: "select",
    values: [  "red",
        { value: "blue", label: "Blue" },
        { value: "green", label: "Green" }, ],
   
},
```

The values can be defined in varying degrees of detail:
Just the values, values with a translatable label, or values with a label and icon.
If you wish to translate your values, you can define them with a label.
Per default, the `name` property is used as the label.

:::info
Contrary to grids, form `staticSelect` values do not support icons.
:::

### asyncSelect

filters.

| Type             | Description                                                                                      |
|------------------|--------------------------------------------------------------------------------------------------|
| `text`           | For `string` based columns. Also used for `asyncSelect` values.                                  |
| `number`         | For `number` based columns.                                                                      |




### block

### fileUpload

### fieldSet

### component

### optionalNestedFields

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
