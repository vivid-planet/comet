import { GridColDef } from "@comet/admin";
import { GridFilterItem, GridSortDirection } from "@mui/x-data-grid";

import { GridCombinationColumnConfig } from "../generateGrid/combinationColumn";
import { UsableFields } from "../generateGrid/usableFields";
import { ColumnVisibleOption } from "../utils/columnVisibility";
import { Icon, ImportReference } from "./miscellaneousConfig";

/**
 * @description
 * For every column, the following general options can be set. Each column `type` may have its individual options in addition to these.
 * @typedef {Object} BaseColumnConfig
 * @property {string} [headerName] - Use this option to set a custom column header name. Translations can be added here.
 * @example
 * {
 *     type: "text",
 *     name: "description",
 *     headerName: "Description",
 *     //...
 * },
 * @property {number} [width] - Set the width of the column. Default is `150`.
 * @property {number} [minWidth] - Set the minimum width of the column. Default is `150`.
 * @property {number} [maxWidth] - Set the maximum width of the column. Default is `undefined`.
 * @property {number} [flex] - Set the flex parameter of the column. Default is `1`.
 * @property {object} [pinned] - Define columns as pinned to the left or right side of the grid.
 * Columns can be pinned to the left or right side of a grid.
 * To do so, add the GraphQL object type property name to either the `left` or `right` array in the `pinned` object.
 * The pinned columns can be updated by the user via the column header context menu.
 *@example
 * // The `description` column is pinned to the left side, and the `quantity` and `color` columns are pinned to the right side.
 * pinned: {
 *     left: [ "description" ],
 *     right: [ "quantity", "color" ],
 * },
 * @property {boolean} [disableExport] - If `true`, exclude this column when generating an Excel export. Default is `false`.
 * @property {string} [headerInfoTooltip] - When set, shows the string as a tooltip on hover over the column header.
 * @property {ColumnVisibleOption} [visible] - Define a column to be visible up to, down from, only for, only not for or between specific breakpoints.
 *  This setting is useful especially for mobile optimizations.
 * The values are defined in this structure: `"direction('breakpoint')"`.
 * @example
 * // A column defined with:
 * visible: "down('md')",
 * // will be visible up to the medium breakpoint. Above that it is hidden.
 * // The column can still be accessed and set to be visible by the user via the column header context menu.
 * @example
 * // A column defined with:
 * visible: "between('sm', 'lg)",
 * // will be visible for the breakpoints `sm`, `md`, and `lg`.
 * // Above and below them the column is hidden.
 * // It can still be accessed and set to be visible by the user via the column header context menu.
 * @property {string} [fieldName] - Used to override naming for nested values when needed.
 */
export type BaseColumnConfig = Pick<GridColDef, "headerName" | "width" | "minWidth" | "maxWidth" | "flex" | "pinned" | "disableExport"> & {
    headerInfoTooltip?: string;
    visible?: ColumnVisibleOption;
    fieldName?: string; // this can be used to overwrite field-prop of column-config
};

/**
 * @typedef {Object} StaticSelectLabelCellContent
 * @property {string} [primaryText] - The primary text to be displayed. Default is the columns' `name` property.
 * @property {string} [secondaryText] - The secondary text to be displayed. It is displayed in a second line below.
 * @property {Icon} [icon] - The icon to be displayed.
 * @example
 * {
 *     type: "staticSelect",
 *     //...
 *     values: [
 *         "red",
 *         { value: "blue", label: "Blue" },
 *         { value: "green", label: { primaryText: "Green", secondaryText: "Hex: #00ff00" } },
 *     ],
 * },
 * @example
 * // With icons
 * {
 *     type: "staticSelect",
 *     //...
 *     values: [
 *         {
 *             value: "blue",
 *             label: { primaryText: "Blue", icon: "StateFilled", color: "info" } // icon name
 *         },
 *         {
 *             value: "green",
 *             label: {
 *                 primaryText: "Green",
 *                 icon: { name: "StateFilled", color: "success" } // icon object
 *             },
 *         },
 *         { value: "red",
 *             label: {
 *                 primaryText: "Red",
 *                 icon: {
 *                     name: "CustomIcon",
 *                     import: "./CustomIconFile",
 *                     color: "error",
 *                 },  // import reference
 *             },
 *         },
 *     ],
 * },
 */
export type StaticSelectLabelCellContent = {
    primaryText?: string;
    secondaryText?: string;
    icon?: Icon;
};

/**
 * @typedef {Object} GridColumnConfig
 * @property {string} type - Define the type of values that is displayed in this column.
 * @property {UsableFields<T>} name - The name of the GraphQL object type property that will be displayed in the column.
 * @property {ImportReference} [filterOperators] - `filterOperators` can be used to import custom filters for a column.
 * They need to be of type `GridFilterOperator` to be usable.
 * An example for custom filter operations can be found [here](@link https://github.com/vivid-planet/comet/blob/main/demo/admin/src/products/future/ProductsGrid.cometGen.ts#L105) in the Comet Demo project.
 * @example
 * // `name` is the name of the exported filter component in the file referenced by the path in `import`.
 * filterOperators: { name: "CustomFilter", import: "./CustomFilterOperators" },
 */
export type GridColumnConfig<T> = (
    | ({ type: "text" } & {
          /**
           * @description This column type is used for simple `string` based values. The value is displayed as is, with text alignment to the left.
           * -   There is no `string` column type. Always use `text` for `string` values.
           * -   `asyncSelect` fields of forms correspond to `text` columns in grids.
           * -   Further formatting of `text` values can be done by using the `combination` column type.
           */
      })
    | ({ type: "number" } & {
          /**
           * @description This column type is used for simple `number` based values. The value is displayed as is, with text alignment to the right.
           * To format the values, use the `combination` column type.
           */
      })
    | ({ type: "boolean" } & {
          /**
           * @description `boolean` values are generated as X and checkmark icons. There is no third undefined value for columns.
           */
      })
    | ({ type: "date" } & {
          /**
           * @description `date` columns are displayed in the format of the current browser locale.
           * To force a specific date format, change it to string in the API Generator and use a `@ResolveField` to format the date.
           */
      })
    | ({ type: "dateTime" } & {
          /**
           * @description `dateTime` columns are displayed in the format of the current browser locale.
           * To force a specific date format, change it to string in the API Generator and use a `@ResolveField` to format the date.
           */
      })
    | ({ type: "staticSelect"; values?: Array<{ value: string; label: string | StaticSelectLabelCellContent } | string> } & {
          /**
           * @description `staticSelect` values can be defined in varying degrees of detail: Just the values, values with a translatable label, or values with a label and icon.
           * Make sure to use identical values for a property across grids and forms with the same GraphQL object type.
           * Translated values are generated as `FormattedMessage`s and they will conflict in the generated `defaultMessages`s otherwise.
           * @property {Array<{ value: string; label: string | StaticSelectLabelCellContent } | string>} [values] - For `staticSelect` type, the values to be displayed.
           * @example
           * // The minimum definition looks like this
           * {
           *     type: "staticSelect",
           *     //...
           *     values: [ "red","blue", "green" ],
           * },
           * @example
           * // With translated label
           * {
           *     type: "staticSelect",
           *     //...
           *     values: [
           *         "red",
           *         { value: "blue", label: "Blue" },
           *         { value: "green", label: { primaryText: "Green", secondaryText: "Hex: #00ff00" } },
           *     ],
           * },
           */
      })
    | ({ type: "block"; block: ImportReference } & {
          /**
           * @property {ImportReference} [block] - Blocks are defined with an import reference to the block component
           * @example
           * {
           *     type: "block",
           *     name: "image",
           *     //...
           *     block: { name: "DamImageBlock", import: "@comet/cms-admin" },
           * },
           */
      })
) & { name: UsableFields<T>; filterOperators?: ImportReference } & BaseColumnConfig;

/**
 * @description This column contains the row context menu as well as custom components passed in via the `rowAction` prop.
 * Additionally, a component can be passed here.
 * @typedef {Object} ActionsGridColumnConfig
 * @property {"actions"} type - The type of the column.
 * @property {ImportReference} [component] - The custom component to be used in the actions column.
 * @example
 * {
 *     type: "actions",
 *     component: { name: "CustomAction", import: "./CustomAction" },
 * },
 */
export type ActionsGridColumnConfig = { type: "actions"; component?: ImportReference } & BaseColumnConfig;

/**
 * @description This option sets an initial filter for the grid.
 * This filter can be overridden by the user via the filter panel.
 * The array values are applied in order.
 * The available filter operators depend on the defined column type.
 * Using `"="` for a `string` value or `"is"` for a `number` value will lead to an error.
 * @typedef {Object} InitialFilterConfig
 * @property {GridFilterItem[]} items - The filter definitions.
 * @property {"and" | "or"} [linkOperator] - The operator to connect the conditions. Default is `"and"`.
 * @example
 * initialFilter: {
 *     items: [
 *         { columnField: "color", operatorValue: "is", value: "green" },
 *         { columnField: "color", operatorValue: "is", value: "red" },
 *     ],
 *     linkOperator: "or",
 * },
 */
type InitialFilterConfig = {
    items: GridFilterItem[];
    linkOperator?: "and" | "or";
};

/**
 * @description The list of all general grid options. These affect the grid as a whole.
 * @typedef {Object} GridConfig
 * @property {"grid"} type - This option determines the type of generation. Set it to `"grid"` to generate a grid.
 * @property {string} gqlType - The GraphQL object type to use for grid generation.
 * The GraphQL object type does not exist? Check the API logs for errors.
 * @property {string} [fragmentName] - When set, uses this custom name for the GQL fragment names.
 * When unset, the fragmentName is generated as `${GQLType}Grid`.
 * Set this to prevent duplicate fragment names when generating multiple grids for the same GraphQL object type.
 * This is highly recommended, but not necessary for generation to function.
 * @property {string} [query] - When set, uses this query instead of the default list query of the `gqlType`.
 * @property {string} [queryParamsPrefix] - When set, prefixes search and filter parameters in the URL with this string.
 * Multiple grids on the same page without `queryParamsPrefix` will access the same filter and search parameters in the URL.
 * This can lead to errors and undesired behavior.
 * To prevent this, define a prefix for each grid to distinguish the parameter sets.
 * @property {Array<GridColumnConfig<T> | GridCombinationColumnConfig<UsableFields<T>> | ActionsGridColumnConfig>} columns - Array of column definitions.
 * They are generated in order of their definition.
 * @property {boolean} [excelExport] - If `true`, the "excelExport" option is included in "More Actions". Default is `false`.
 * @property {boolean} [add] - If `true`, includes the "add" operation in the row context menu. Default is `true`.
 * This will be overridden when `readOnly` is set to `true`.
 * @property {boolean} [edit] - If `true`, includes the "edit" operation in the row context menu. Default is `true`.
 * This will be overridden when `readOnly` is set to `true`.
 * @property {boolean} [delete] - If `true`, includes the "delete" operation in the row context menu. Default is `true`.
 * This will be overridden when `readOnly` is set to `true`.
 * @property {boolean} [copyPaste] - If `true`, includes the "copyPaste" operation in the row context menu. Default is `true`.
 * This will be overridden when `readOnly` is set to `true`.
 * @property {boolean} [readOnly] - If `true`, disables "add", "edit", "delete" and "copyPaste". Default is `false`.
 * @property {Array<{ field: string; sort: GridSortDirection }>} [initialSort] - When set, the grids columns are rendered with this preset sort.
 *  This sort can be overridden by the user via the grid column headers.
 * The array values are applied in order.
 * @example
 * // Assume the used GraphQL object type has the properties `quantity` and `description`.
 * // A grid with this `initialSort` configuration will list all entries by most `quantity`,
 * // then entries with the same `quantity` are sorted alphabetically by `description`.
 * initialSort: [
 *     {field: "quantity", sort: "desc"},
 *     {field: "description", sort: "asc"},
 * ],
 * @property {InitialFilterConfig} [initialFilter] - When set, the grid columns are rendered with this preset filter.
 * This filter can be overridden by the user via the filter panel.
 * The array values are applied in order.
 * The available filter operators depend on the defined column type.
 * Using `"="` for a `string` value or `"is"` for a `number` value will lead to an error.
 * @example
 * initialFilter: {
 *     items: [
 *         { columnField: "color", operatorValue: "is", value: "green" },
 *         { columnField: "color", operatorValue: "is", value: "red" },
 *     ],
 *     linkOperator: "or",
 * },
 * @property {boolean} [filterProp] - If `true`, a parameter to pass a fixed filter to the grid component is generated.
 * This filter does not show up in the filter panel and cannot be altered by the user.
 * @property {boolean} [toolbar] - If `false`, no toolbar is generated. Default is `true`.
 * This overrides all other toolbar related options such as `toolbarActionProp`, `excelExport`, or `newEntryText`.
 * @property {boolean} [toolbarActionProp] - If `true`, a parameter to pass a custom toolbar action to the grid is generated.
 * This option will be overridden by the options `toolbar: false` or `add: false`.
 * @property {string} [newEntryText] - If set, this string will be generated as the message in the main action button of the toolbar.
 * Setting this implicitly enables the generation of a main action button that will link to a `StackPage` with pageName="add".
 * This option will be overridden by the options `toolbar: false` or `add: false`.
 * @property {boolean} [rowActionProp] - If `true`, a parameter to pass a custom row action to the grid is generated.
 * It is generated into the `actions` column of the grid.
 * @property {"multiSelect" | "singleSelect"} [selectionProps] - The selection mode for the grid.
 */
export type GridConfig<T extends { __typename?: string }> = {
    type: "grid";
    gqlType: T["__typename"];
    fragmentName?: string;
    query?: string;
    queryParamsPrefix?: string;
    columns: Array<GridColumnConfig<T> | GridCombinationColumnConfig<UsableFields<T>> | ActionsGridColumnConfig>;
    excelExport?: boolean;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    copyPaste?: boolean;
    readOnly?: boolean;
    initialSort?: Array<{ field: string; sort: GridSortDirection }>;
    initialFilter?: InitialFilterConfig;
    filterProp?: boolean;
    toolbar?: boolean;
    toolbarActionProp?: boolean;
    newEntryText?: string;
    rowActionProp?: boolean;
    selectionProps?: "multiSelect" | "singleSelect";
};
