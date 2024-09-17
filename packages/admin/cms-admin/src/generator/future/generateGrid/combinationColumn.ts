import { GridColDef } from "@comet/admin";
import { pascalCase } from "change-case";
import { FormattedNumber } from "react-intl";

import { DataGridSettings } from "../generator";
import { getFormattedMessageNode } from "../utils/intl";

type AbstractField<FieldName extends string> = {
    field: FieldName;
    emptyValue?: string;
};

type StringField<FieldName extends string> = AbstractField<FieldName> & {
    type: "string";
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

type StaticSelectField<FieldName extends string> = AbstractField<FieldName> & {
    type: "staticSelect";
    values: Array<
        | string
        | {
              value: string | number | boolean;
              label: string;
          }
    >;
};

type FormattedMessage<FieldName extends string> = {
    type: "formattedMessage";
    message: string;
    valueFields: Record<string, Field<FieldName>>;
};

type Field<FieldName extends string> =
    | StaticText
    | FieldName
    | StringField<FieldName>
    | NumberField<FieldName>
    | StaticSelectField<FieldName>
    | FormattedMessage<FieldName>;

export type GridCombinationColumnConfig<FieldName extends string> = {
    type: "combination";
    name: string;
    primaryText?: Field<FieldName>;
    secondaryText?: Field<FieldName>;
} & DataGridSettings &
    Pick<GridColDef, "sortBy">;

type CellContent = {
    textContent: string;
    variableDefinitions?: string[];
};

const getTextForCellContent = (textConfig: Field<string>, messageIdPrefix: string, target: "primary" | "secondary"): CellContent => {
    if (typeof textConfig === "string") {
        return {
            textContent: `row.${textConfig}`,
        };
    }

    if (textConfig.type === "static") {
        return {
            textContent: getFormattedMessageNode(messageIdPrefix, textConfig.text),
        };
    }

    if (textConfig.type === "formattedMessage") {
        const variableDefinitions: string[] = [];

        const values = Object.entries(textConfig.valueFields)
            .map(([key, value]) => {
                const { textContent, variableDefinitions: cellVariableDefinitions } = getTextForCellContent(
                    value,
                    `${messageIdPrefix}.${key}`,
                    target,
                );

                if (cellVariableDefinitions?.length) {
                    variableDefinitions.push(...cellVariableDefinitions);
                }

                return `${key}: ${textContent}`;
            })
            .join(", ");

        return {
            textContent: getFormattedMessageNode(messageIdPrefix, textConfig.message, `{${values}}`),
            variableDefinitions,
        };
    }

    const emptyText = "emptyValue" in textConfig ? getFormattedMessageNode(`${messageIdPrefix}.empty`, textConfig.emptyValue) : "'-'";
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

        return {
            textContent: `typeof ${rowValue} === "undefined" || ${rowValue} === null ? ${emptyText} : <FormattedNumber ${formattedNumberPropsString} />`,
        };
    }

    if (textConfig.type === "staticSelect") {
        const variableNamePrefix = `${target}Text${pascalCase(textConfig.field)}`;
        const labelsVariableName = `${variableNamePrefix}Labels`;
        const emptyMessageVariableName = `${variableNamePrefix}EmptyMessage`;

        const emptyMessage = `const ${emptyMessageVariableName} = ${emptyText};`;

        const labelMapping = textConfig.values
            .map((valueOption) => {
                const value = typeof valueOption === "string" ? valueOption : valueOption.value;
                const label = typeof valueOption === "string" ? valueOption : valueOption.label;
                return `${value}: ${getFormattedMessageNode(`${messageIdPrefix}.${value}`, label)}`;
            })
            .join(", ");

        const labelMappingVar = `const ${labelsVariableName}: Record<string, React.ReactNode> = { ${labelMapping} };`;
        const textContent =
            `(${rowValue} == null ? ${emptyMessageVariableName} : ${labelsVariableName}[` + `\`\${${rowValue}}\`` + `] ?? ${rowValue})`;

        return {
            textContent,
            variableDefinitions: [emptyMessage, labelMappingVar],
        };
    }

    return {
        textContent: `${rowValue} ?? ${emptyText}`,
    };
};

export const getCombinationColumnRenderCell = (column: GridCombinationColumnConfig<string>, messageIdPrefix: string) => {
    const gridCellContentProps: Record<string, string> = {};
    const allVariableDefinitions: string[] = [];

    if (column.primaryText) {
        const { textContent, variableDefinitions = [] } = getTextForCellContent(column.primaryText, `${messageIdPrefix}.primaryText`, "primary");
        gridCellContentProps.primaryText = textContent;
        allVariableDefinitions.push(...variableDefinitions);
    }

    if (column.secondaryText) {
        const { textContent, variableDefinitions = [] } = getTextForCellContent(
            column.secondaryText,
            `${messageIdPrefix}.secondaryText`,
            "secondary",
        );
        gridCellContentProps.secondaryText = textContent;
        allVariableDefinitions.push(...variableDefinitions);
    }

    const allUniqueVariableDefinitions = Array.from(new Set(allVariableDefinitions));

    return `({ row }) => {
        ${allUniqueVariableDefinitions.join("\n")}
        return <GridCellContent ${Object.entries(gridCellContentProps)
            .map(([key, value]) => `${key}={${value}}`)
            .join(" ")} />;
    }`;
};

const getFieldNamesFromText = (textConfig: Field<string>): string[] => {
    if (typeof textConfig === "string") {
        return [textConfig];
    }

    if (textConfig.type === "static") {
        return [];
    }

    if (textConfig.type === "formattedMessage") {
        return Object.values(textConfig.valueFields).flatMap((value) => getFieldNamesFromText(value));
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
