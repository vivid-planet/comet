import { FinalFormFileUploadProps } from "../../../form/file/FinalFormFileUpload";
import { Adornment, ImportReference } from "./miscellaneousConfig";

/**
 * @typedef {Object} SingleFileFormFieldConfig
 * @property {"fileUpload"} type - The type of the field.
 * @property {false} [multiple] - If `false`, only a single file can be uploaded.
 * @property {1} [maxFiles] - The maximum number of files to be uploaded.
 * @property {boolean} [download] - If `true`, allows to download the file.
 * @property {number} [maxFileSize] - The maximum file size in Bytes.
 * @property {boolean} [readOnly] - If `true`, the field is not editable.
 * @property {string} [layout] - The layout of the field.
 * @property {string} [accept] - The accepted file types.
 */
type SingleFileFormFieldConfig = { type: "fileUpload"; multiple?: false; maxFiles?: 1; download?: boolean } & Pick<
    Partial<FinalFormFileUploadProps<false>>,
    "maxFileSize" | "readOnly" | "layout" | "accept"
>;

/**
 * @typedef {Object} MultiFileFormFieldConfig
 * @property {"fileUpload"} type - The type of the field.
 * @property {true} multiple - If `true`, allows to upload multiple files.
 * @property {number} [maxFiles] - The maximum number of files to be uploaded.
 * @property {boolean} [download] - If `true`, allows to download the files.
 * @property {number} [maxFileSize] - The maximum file size in Bytes.
 * @property {boolean} [readOnly] - If `true`, the field is not editable.
 * @property {string} [layout] - The layout of the field.
 * @property {string} [accept] - The accepted file types.
 */
type MultiFileFormFieldConfig = { type: "fileUpload"; multiple: true; maxFiles?: number; download?: boolean } & Pick<
    Partial<FinalFormFileUploadProps<true>>,
    "maxFileSize" | "readOnly" | "layout" | "accept"
>;

/**
 * @typedef {Object} InputBaseFieldConfig
 * @property {Adornment} [startAdornment] - The adornment to be shown at the start of the input field.
 * @property {Adornment} [endAdornment] - The adornment to be shown at the end of the input field.
 */
type InputBaseFieldConfig = {
    startAdornment?: Adornment;
    endAdornment?: Adornment;
};

/**
 * @description Arbitrary components can be used in forms as well. They are defined with an import reference:
 * @typedef {Object} ComponentFormFieldConfig
 * @property {"component"} type - The type of the field.
 * @property {ImportReference} component - The component to be used in the field.
 * @example
 * {
 *     type: "component",
 *     component: { name: "FutureProductNotice", import: "../../helpers/FutureProductNotice" },
 * },
 */
export type ComponentFormFieldConfig = { type: "component"; component: ImportReference };

/**
 * @typedef {Object} FormFieldConfig
 * @property {string} type - Define the type of value that is entered in this field.
 * @property {string} name - The name of the GraphQL object type property that will be shown in that field.
 * @property {string} [label] - The custom field label. Default is the `name` property.
 * @example
 * // Add translations via the label
 * {
 *     type: "text",
 *     name: "description",
 *     label: "Description",
 *     //...
 * },
 * @property {boolean} [required] - If `true`, the field is generated as `required`.
 * @property {boolean} [virtual] - If `true`, the field value will not be persisted.
 * This field only exists in the form state and not in the API.
 * A `virtual` field can be used as a filter for an `asyncSelect` field for example.
 * @property {ImportReference} [validate] - The custom validation for the field.
 * Via the `validate` option, custom validation can be set. It can be passed as an import reference.
 * @example
 * // `name` is the name of the exported filter component in the file referenced by the path in `import`.
 * {
 *     type: "number",
 *     name: "price",
 *     validate: {name: "PriceValidation", import: "./PriceValidation"},
 *     //...
 * },
 * @property {string} [helperText] - The helper text displayed below the input field.
 * @property {boolean} [readOnly] - If `true`, the field is not editable.
 */
export type FormFieldConfig<T> = (
    | ({ type: "text"; multiline?: boolean } & InputBaseFieldConfig & {
              /**
               * @property {boolean} [multiline] - If `true`, the text field will be multiline.
               */
          })
    | ({ type: "number" } & InputBaseFieldConfig)
    | ({
          type: "numberRange";
          minValue: number;
          maxValue: number;
          disableSlider?: boolean;
      } & InputBaseFieldConfig & {
              /**
               * @description This field generates two number inputs for a range.
               * When adding an adornment to this field, both fields will have the adornment.
               * The field requires a set minimum and maximum value.
               * @property {number} minValue - The minimum value for the number range.
               * @property {number} maxValue - The maximum value for the number range.
               * @property {boolean} [disableSlider] - If `true`, disables the slider for the number range.
               * @example
               * {
               *     type: "numberRange",
               *     name: "price",
               *     min: 1,
               *     max: 100,
               *     disableSlider: true,
               * },
               */
          })
    | ({ type: "boolean" } & {
          /**
           * @description `boolean` fields are generated as sliders.
           */
      })
    | ({ type: "date" } & InputBaseFieldConfig)
    | ({ type: "dateTime" } & InputBaseFieldConfig & {
              /**
               * @description A `DateTimePicker` field is generated.
               * When adding an adornment to this field, both fields will have the adornment.
               */
          })
    | ({
          type: "staticSelect";
          values?: Array<{ value: string; label: string } | string>;
          inputType?: "select" | "radio";
      } & Omit<InputBaseFieldConfig, "endAdornment"> & {
              /**
               * @description `staticSelect` fields can be generated in two different styles: As radio buttons or as a select field.
               * The default behavior is to use radio buttons for equal or less than 5 values and a select field for more than 5 values.
               * This can be overridden by setting the `inputType` option to `radio` or `select`.
               * Contrary to `staticSelect` in grids, form `staticSelect` values do not support icons.
               * @property {Array<{ value: string; label: string } | string>} [values] - The options for the static select field.
               * @property {"select" | "radio"} [inputType] - The input type for the static select field.
               * @example
               * // The values can be defined in varying degrees of detail:
               * // Just the values, values with a translatable label, or values with a label and icon.
               * // Per default, the `name` property is used as the label.
               * {
               *     type: "staticSelect",
               *     name: "color",
               *     inputType: "select",
               *     values: [
               *         "red",
               *         { value: "blue", label: "Blue" },
               *         { value: "green", label: "Green" },
               *     ],
               * },
               */
          })
    | ({
          type: "asyncSelect";
          rootQuery: string;
          labelField?: string;
          filterField?: { name: string; gqlName?: string };
      } & Omit<InputBaseFieldConfig, "endAdornment"> & {
              /**
               * @description `asyncSelect` fields are used for selecting values from a list of loaded values.
               * This field currently supports only object values, meaning fields that are references to other entities.
               * @property {string} rootQuery - The root query for the async select field values.
               * @property {string} [labelField] - `labelField` specifies the property of the referenced entity that
               * will be displayed in the select field.
               * If no `labelField` is provided, the generator tries to find `string` properties named `name` or `title`.
               * If that is unsuccessful, the first `string` field, if found, is used.
               * When no field is found, the Generator will error.
               * @property {{ name: string; gqlName?: string }} [filterField] - The field to use as the filter in the async select field.
               * `asyncSelect` field values can be filtered with `filterField`.
               * `name` and `gqlName` are searched for as properties in the `rootQuery`.
               * If found, that field is used to filter.
               * If they are not found, the Generator tries to find them as filter arguments in the `rootQuery`.
               * When `gqlName` is set, then the variable is generated as an explicit filter.
               * If only `name` is set, then the variable is generated as a filter argument.
               * @example
               * // A field definition like this:
               * {
               *     type: "asyncSelect",
               *     name: "category",
               *     rootQuery: "productCategories",
               *     //...
               * },
               * // will generate a field with a query like this:
               * <AsyncSelectField
               *     //...
               *     loadOptions={async () => {
               *         const { data } = await client.query<
               *             GQLProductCategoriesSelectQuery,
               *             GQLProductCategoriesSelectQueryVariables
               *         >({
               *             query: gql`
               *                 query ProductCategoriesSelect {
               *                     productCategories {
               *                         nodes {
               *                             id
               *                             title
               *                         }
               *                     }
               *                 }
               *             `,
               *         });
               *         return data.productCategories.nodes;
               *     }}
               * />
               * // As the `filterField` is unset, only the defined `rootQuery` without arguments is generated.
               * @example
               * // Assume a `Product` entity has a `type` field and a `Manufacturer` entity has an embeddable `address` field.
               * // The country of that `address` will be the content of the select field.
               * // The following example filters the available `Manufacturer.address` values by the `Product.type` field.
               * {
               *     type: "asyncSelect",
               *     name: "manufacturer",
               *     rootQuery: "manufacturers",
               *     filterField: {
               *         name: "type",
               *         gqlName: "addressAsEmbeddable_country",
               *     },
               *     //...
               * },
               * // will generate a field with a query looking like this:
               * <AsyncSelectField
               *     //...
               *     loadOptions={async () => {
               *         const { data } = await client.query<GQLManufacturersSelectQuery, GQLManufacturersSelectQueryVariables>({
               *             query: gql`
               *                     query ManufacturersSelect($filter: ManufacturerFilter) {
               *                         manufacturers(filter: $filter) {
               *                             nodes {
               *                                 id
               *                                 name
               *                             }
               *                         }
               *                     }
               *                 `,
               *             variables: { filter: { addressAsEmbeddable_country: { equal: values.type } } },
               *         });
               *     return data.manufacturers.nodes;
               *     }}
               * />
               * <OnChangeField name="type">
               *     {(value, previousValue) => {
               *         if (value.id !== previousValue.id) {
               *             form.change("manufacturer", undefined);
               *         }
               *     }}
               * </OnChangeField>
               * // As the `gqlName` is set, the field is generated as an explicit filter.
               * // The `<OnChangeField>` component is generated to reset the `manufacturer` field when the `type` field changes.
               * // These examples can be found [here](@link https://github.com/vivid-planet/comet/blob/main/demo/admin/src/products/future/ProductForm.cometGen.ts#L58) in the Demo project.
               */
          })
    | {
          type: "block";
          block: ImportReference & {
              /**
               * @description Block fields are defined with an import reference to the block component:
               * @example
               * {
               *     type: "block",
               *     name: "image",
               *     label: "Image",
               *     block: { name: "DamImageBlock", import: "@comet/cms-admin" },
               * },
               */
          };
      }
    | SingleFileFormFieldConfig
    | MultiFileFormFieldConfig
) & {
    name: keyof T;
    label?: string;
    required?: boolean;
    virtual?: boolean;
    validate?: ImportReference;
    helperText?: string;
    readOnly?: boolean;
};

/**
 * Checks if the argument is a FormFieldConfig.
 * @param {any} arg - The argument to check.
 * @returns {boolean} - `true` if the argument is a FormFieldConfig, otherwise `false`.
 */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function isFormFieldConfig<T>(arg: any): arg is FormFieldConfig<T> {
    return !isFormLayoutConfig(arg);
}

/**
 * @description Some optional fields are rarely needed.
 * With `optionalNestedFields`, these can be hidden behind a switch to reduce visual clutter.
 * However, all fields within `optionalNestedFields` must be combined into one type in the API.
 * Only optional fields work in this section. `required` or `component` fields will lead to an error.
 * `optionalNestedFields` cannot be nested within each other. This will result in an error.
 * @typedef {Object} OptionalNestedFieldsConfig
 * @property {"optionalNestedFields"} type - The type of the field.
 * @property {string} name - The `name` of the object containing all the optional fields. Will be used as label for the switch.
 * @property {string} [checkboxLabel] - If set, overrides the `name` and is used as label for the switch.
 * @property {FormFieldConfig<any>[]} fields - The list of fields within the optional nested fields.
 * @example
 * // A field defined like this:
 * {
 *     type: "optionalNestedFields",
 *     name: "dimensions",
 *     checkboxLabel: "Configure dimensions",
 *     fields: [
 *         { type: "number", name: "width", label: "Width" },
 *         { type: "number", name: "height", label: "Height" },
 *         { type: "number", name: "depth", label: "Depth" },
 *     ],
 * },
 * // has `width`, `height` and `depth` combined into one type in the entities property definition.
 * // See the example in the entity [here](@link https://github.com/vivid-planet/comet/blob/main/demo/api/src/products/entities/product.entity.ts#L162).
 */
type OptionalNestedFieldsConfig<T> = {
    type: "optionalNestedFields";
    name: keyof T; // object name containing fields
    checkboxLabel?: string;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    fields: FormFieldConfig<any>[];
};

/**
 * @description A `fieldSet` is used to wrap form fields to create a collapsible section. `fieldSet`s cannot be nested within each other. This will result in an error.
 * @typedef {Object} FormLayoutConfig
 * @property {"fieldSet"} type - The type of the layout.
 * @property {string} name - The `string` that will prefix all generated `FormattedMessage` `id`s. Will be displayed as header title if no `title` is set.
 * @property {string} [title] - The `title` that is displayed in the header of the `fieldSet`. Overrides the `name`.
 * @property {string} [supportText] - A subtitle that is shown below the `title`.
 * @property {boolean} [collapsible] - If `true`, the layout is collapsible.
 * @property {boolean} [initiallyExpanded] - If `true`, the layout is initially expanded.
 * @property {(FormFieldConfig<T> | OptionalNestedFieldsConfig<T> | ComponentFormFieldConfig)[]} fields - The list of fields within the layout.
 */
export type FormLayoutConfig<T> =
    | {
          type: "fieldSet";
          name: string;
          title?: string;
          supportText?: string; // can contain field-placeholder
          collapsible?: boolean; // default true
          initiallyExpanded?: boolean; // default false
          fields: (FormFieldConfig<T> | OptionalNestedFieldsConfig<T> | ComponentFormFieldConfig)[];
      }
    | OptionalNestedFieldsConfig<T>;
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function isFormLayoutConfig<T>(arg: any): arg is FormLayoutConfig<T> {
    return arg.type !== undefined && ["fieldSet", "optionalNestedFields"].includes(arg.type);
}

/**
 * Here is an overview of all general form options. These affect the form as a whole. Detailed explanations can be found below.
 * @typedef {Object} FormConfig
 * @property {"form"} type - This option determines the type of generation. Set it to `"form"` to generate a form.
 * @property {string} gqlType - The GraphQL object type to use for form generation.
 * The GraphQL object type does not exist? Check the API logs for errors.
 * @property {"edit" | "add" | "all"} [mode] - The mode of the form.
 * This option determines what kind of actions the form will support.
 * If only an "edit" form is needed, set it to `"edit"`.
 * If only an "add" form is needed, set it to `"add"`.
 * The default is `"all"`, meaning both `"edit"` and `"add"` will be available in the generated form.
 * @property {string} [fragmentName] - When set, uses this custom name for the GQL fragment names. Highly recommended.
 * When unset, the fragmentName is generated as `${GQLType}Form`. Set this to prevent duplicate fragment names when
 * generating multiple forms for the same GraphQL object type.
 * This is highly recommended, but not necessary for generation to function.
 * @property {string} [createMutation] - When set, uses this query instead of the default create query of the `gqlType`.
 * When unset, the Admin Generator uses the default create mutation of the GraphQL object type for the form. `createMutation`
 * can be used to set a custom list query.
 * @property {(FormFieldConfig<T> | FormLayoutConfig<T> | ComponentFormFieldConfig)[]} fields - The list of fields within the form.
 * `fields` contains all information for form fields that will be displayed.
 * They are generated in order of their definition.
 */
export type FormConfig<T extends { __typename?: string }> = {
    type: "form";
    gqlType: T["__typename"];
    mode?: "edit" | "add" | "all";
    fragmentName?: string;
    createMutation?: string;
    fields: (FormFieldConfig<T> | FormLayoutConfig<T> | ComponentFormFieldConfig)[];
};
