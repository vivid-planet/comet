import { GridColDef } from "@comet/admin";
import { FormattedNumber } from "react-intl";

import { DataGridSettings } from "../generator";

type AbstractField<FieldName extends string> = {
    field: FieldName;
    emptyValue?: string;
};

type TextField<FieldName extends string> = AbstractField<FieldName> & {
    type: "text";
};

type StaticText = {
    type: "static";
    text: string;
};

type FormattedNumberPropsForNumberField = Omit<React.ComponentProps<typeof FormattedNumber>, "value" | "children">;

type NumberField<FieldName extends string> = AbstractField<FieldName> &
    FormattedNumberPropsForNumberField & {
        type: "number";
        decimals?: number;
    };
// type StaticSelectField<FieldName extends string> = AbstractField<FieldName> & {
//     type: "staticSelect";
//     options: Array<{
//         value: string | number | boolean;
//         label: string;
//     }>;
// };

// type Field<FieldName extends string> =
//     | StaticText
//     | FieldName
//     | StringField<FieldName>
//     | NumberField<FieldName>
//     | StaticSelectField<FieldName>;

// type FieldGroup<FieldName extends string> = {
//     type: "group";
//     fields: Array<Field<FieldName> | FieldGroup<FieldName>>;
//     separator?: string;
// };

// type TextConfig<FieldName extends string> = Field<FieldName> | FieldGroup<FieldName>;

type Field<FieldName extends string> = StaticText | FieldName | TextField<FieldName> | NumberField<FieldName>;

type TextConfig<FieldName extends string> = Field<FieldName>;

export type GridCombinationColumnConfig<FieldName extends string> = {
    type: "combination";
    name: string;
    primaryText?: TextConfig<FieldName>;
    secondaryText?: TextConfig<FieldName>;
} & DataGridSettings &
    Pick<GridColDef, "sortBy">;

const getTextForCellContent = (textConfig: TextConfig<string>, messageIdPrefix: string) => {
    if (typeof textConfig === "string") {
        return `row.${textConfig}`;
    }

    if (textConfig.type === "static") {
        return `<FormattedMessage id="${messageIdPrefix}" defaultMessage="${textConfig.text}" />`;
    }

    const emptyText =
        "emptyValue" in textConfig ? `<FormattedMessage id="${messageIdPrefix}.empty" defaultMessage="${textConfig.emptyValue}" />` : "'-'";

    const rowValue = `row.${textConfig.field.replace(/\./g, "?.")}`;

    if (textConfig.type === "number") {
        const { type, decimals: decimalsConfigValue, field, emptyValue, ...configForFormattedNumberProps } = textConfig;

        const hasCurrency = Boolean(textConfig.currency);
        const hasUnit = Boolean(textConfig.unit);

        const defaultDecimalsProp = hasCurrency && decimalsConfigValue === undefined ? 2 : decimalsConfigValue;
        let defaultStyleProp: string | undefined = undefined;

        if (hasCurrency) {
            defaultStyleProp = '"currency"';
        } else if (hasUnit) {
            defaultStyleProp = '"unit"';
        }

        const formattedNumberProps: Record<string, unknown> = {
            value: `{${rowValue}}`,
            minimumFractionDigits: typeof defaultDecimalsProp !== "undefined" ? `{${defaultDecimalsProp}}` : undefined,
            maximumFractionDigits: typeof defaultDecimalsProp !== "undefined" ? `{${defaultDecimalsProp}}` : undefined,
            style: typeof defaultStyleProp !== "undefined" ? defaultStyleProp : undefined,
        };

        Object.entries(configForFormattedNumberProps).forEach(([key, value]) => {
            if (typeof value === "string") {
                formattedNumberProps[key] = `"${value}"`;
            } else {
                formattedNumberProps[key] = `{${value}}`;
            }
        });

        const formattedNumberPropsString = Object.entries(formattedNumberProps)
            .map(([key, value]) => {
                if (typeof value === "undefined") {
                    return null;
                }
                return `${key}=${value}`;
            })
            .join(" ");

        return `typeof ${rowValue} === "undefined" || ${rowValue} === null ? ${emptyText} : <FormattedNumber ${formattedNumberPropsString} />`;
    }

    return `${rowValue} ?? ${emptyText}`;
};

export const getCombinationColumnRenderCell = (column: GridCombinationColumnConfig<string>, messageIdPrefix: string) => {
    const gridCellContentProps: Record<string, string> = {};

    if (column.primaryText) {
        gridCellContentProps.primaryText = getTextForCellContent(column.primaryText, `${messageIdPrefix}.primaryText`);
    }

    if (column.secondaryText) {
        gridCellContentProps.secondaryText = getTextForCellContent(column.secondaryText, `${messageIdPrefix}.secondaryText`);
    }

    return `({ row }) => {
        return <GridCellContent ${Object.entries(gridCellContentProps)
            .map(([key, value]) => `${key}={${value}}`)
            .join(" ")} />;
    }`;
};

const getFieldNamesFromText = (textConfig: TextConfig<string>): string[] => {
    if (typeof textConfig === "string") {
        return [textConfig];
    }

    if (textConfig.type === "static") {
        return [];
    }

    return [textConfig.field];
};

export const getAllColumnFieldNames = (column: GridCombinationColumnConfig<string>): string[] => {
    const fieldNames: string[] = [];

    if (column.primaryText) {
        fieldNames.push(...getFieldNamesFromText(column.primaryText));
    }

    if (column.secondaryText) {
        fieldNames.push(...getFieldNamesFromText(column.secondaryText));
    }

    return fieldNames.filter((fieldName) => fieldName !== "id");
};
