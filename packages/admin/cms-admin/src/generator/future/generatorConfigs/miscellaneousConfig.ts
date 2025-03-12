import { IconName } from "@comet/admin-icons";
import { IconProps } from "@mui/material";

export type ImportReference = {
    name: string;
    import: string;
};

export type IconObject = Pick<IconProps, "color" | "fontSize"> & {
    name: IconName;
};

/**
 * @description Icons can be defined in multiple ways: Just the icon name, an icon object or an import reference.
 * All icons from Comet can be used this way. If you need a custom icon, use an import reference.
 * The available colors are all the supported theme colors.
 * @example
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
export type Icon = IconName | IconObject | ImportReference;

/**
 * @description
 * Most fields support start and end adornments. These can be used to add icons to the beginning or end of the input fields.
 * Icons can be defined in multiple ways: As just a `string`, an icon name, an icon object or an import reference.
 * All icons from Comet can be used this way. If you need a custom icon, use an import reference.
 * The available colors are all the supported theme colors.
 * @example
 * //...
 * {
 *     type: "numberRange",
 *     name: "priceRange",
 *     minValue: 1,
 *     maxValue: 100,
 *     startAdornment: "€", // string
 * },
 * { type: "date", name: "availableSince", endAdornment: { icon: "CalendarToday" } }, // icon name
 * { type: "dateTime", name: "purchaseDateTime", startAdornment: { icon: { name: "CalendarToday" }  } }, // icon object
 * {
 *     type: "staticSelect", name: "productType",
 *     endAdornment: {
 *         icon: {
 *             name: "CustomIcon",
 *             import: "./CustomIconFile",
 *         }, // import reference
 *     },
 * },
 * //...
 */
export type Adornment = string | { icon: Icon };
