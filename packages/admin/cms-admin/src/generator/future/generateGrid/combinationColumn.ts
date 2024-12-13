import { GridColDef } from "@comet/admin";
import { FormattedNumber } from "react-intl";

import { BaseColumnConfig, ImportReference } from "../generator";
import {
    FormattedNumberOptions,
    getFormattedMessageNode,
    getFormattedMessageString,
    getFormattedNumberNode,
    getFormattedNumberString,
} from "../utils/intl";

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

type GroupedField<FieldName extends string> = {
    type: "group";
    fields: Field<FieldName>[];
};

type Field<FieldName extends string> =
    | StaticText
    | FieldName
    | TextField<FieldName>
    | NumberField<FieldName>
    | StaticSelectField<FieldName>
    | FormattedMessage<FieldName>
    | GroupedField<FieldName>;

export type GridCombinationColumnConfig<FieldName extends string> = {
    type: "combination";
    name: string;
    primaryText?: Field<FieldName>;
    secondaryText?: Field<FieldName>;
    filterOperators?: ImportReference;
} & BaseColumnConfig &
    Pick<GridColDef, "sortBy">;

type CellContent = {
    textContent: string;
    variableDefinitions?: string[];
};

const getTextForCellContent = (textConfig: Field<string>, messageIdPrefix: string, requireStrings: boolean): CellContent => {
    const formattedMessage = requireStrings ? getFormattedMessageString : getFormattedMessageNode;
    const formattedNumber = requireStrings ? getFormattedNumberString : getFormattedNumberNode;

    if (typeof textConfig !== "string" && textConfig.type === "static") {
        return {
            textContent: formattedMessage(messageIdPrefix, textConfig.text),
        };
    }

    if (typeof textConfig !== "string" && textConfig.type === "formattedMessage") {
        const variableDefinitions: string[] = [];

        const values = Object.entries(textConfig.valueFields)
            .map(([key, value]) => {
                const { textContent, variableDefinitions: cellVariableDefinitions } = getTextForCellContent(
                    value,
                    `${messageIdPrefix}.${key}`,
                    requireStrings,
                );

                if (cellVariableDefinitions?.length) {
                    variableDefinitions.push(...cellVariableDefinitions);
                }

                return `${key}: ${textContent}`;
            })
            .join(", ");

        return {
            textContent: formattedMessage(messageIdPrefix, textConfig.message, `{${values}}`),
            variableDefinitions,
        };
    }

    if (typeof textConfig !== "string" && textConfig.type === "group") {
        const variableDefinitions: string[] = [];

        const items = textConfig.fields.map((field) => {
            const { textContent, variableDefinitions: cellVariableDefinitions } = getTextForCellContent(
                field,
                `${messageIdPrefix}.${typeof field !== "string" && "field" in field ? field.field : "__TODO__"}`, // TODO: Which value can we use here??
                true,
            );
            if (cellVariableDefinitions?.length) {
                variableDefinitions.push(...cellVariableDefinitions);
            }
            return textContent;
        });

        // TODO: Find a way to do this without using for formatted message id prefix
        const uniqueVariableNamePrefix = messageIdPrefix
            .split(".")
            .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
            .join("");

        const groupValuesVariableName = `${uniqueVariableNamePrefix}GroupValues`;

        variableDefinitions.push(`const ${groupValuesVariableName}: string[] = [${items.join(", ")}];`); // TODO: Variable name should contain "primary" or "secondary"

        return {
            textContent: `${groupValuesVariableName}.filter(Boolean).join(" • ")`,
            variableDefinitions,
        };
    }

    const emptyText =
        typeof textConfig !== "string" && "emptyValue" in textConfig
            ? formattedMessage(`${messageIdPrefix}.empty`, textConfig.emptyValue ?? "")
            : "''";

    const fieldName = typeof textConfig === "string" ? textConfig : textConfig.field;
    const rowValue = `row.${fieldName.replace(/\./g, "?.")}`;
    const stringTextContent = `${rowValue} ?? ${emptyText}`;

    if (typeof textConfig === "string") {
        return {
            textContent: stringTextContent,
        };
    }

    if (textConfig.type === "number") {
        const { type, decimals: decimalsConfigValue, field, emptyValue, ...numberOptionsFromConfig } = textConfig;

        const hasCurrency = Boolean(textConfig.currency);
        const hasUnit = Boolean(textConfig.unit);

        const defaultDecimalsProp = hasCurrency && decimalsConfigValue === undefined ? 2 : decimalsConfigValue;
        let defaultStyleProp: string | undefined = undefined;

        if (hasCurrency) {
            defaultStyleProp = "currency";
        } else if (hasUnit) {
            defaultStyleProp = "unit";
        }

        const numberOptions: FormattedNumberOptions = {
            minimumFractionDigits: typeof defaultDecimalsProp !== "undefined" ? defaultDecimalsProp : undefined,
            maximumFractionDigits: typeof defaultDecimalsProp !== "undefined" ? defaultDecimalsProp : undefined,
            style: typeof defaultStyleProp !== "undefined" ? defaultStyleProp : undefined,
            ...numberOptionsFromConfig,
        };

        return {
            textContent: `typeof ${rowValue} === "undefined" || ${rowValue} === null ? ${emptyText} : ${formattedNumber(rowValue, numberOptions)}`,
        };
    }

    if (textConfig.type === "staticSelect") {
        const labelsVariableName = `${textConfig.field}Labels`;

        const labelMapping = textConfig.values
            .map((valueOption) => {
                const value = typeof valueOption === "string" ? valueOption : valueOption.value;
                const label = typeof valueOption === "string" ? valueOption : valueOption.label;
                return `${value}: ${formattedMessage(`${messageIdPrefix}.${value}`, label)}`;
            })
            .join(", ");

        const labelMappingType = requireStrings ? "Record<string, string>" : "Record<string, React.ReactNode>";
        const labelMappingVar = `const ${labelsVariableName}: ${labelMappingType} = { ${labelMapping} };`;
        const textContent = `(${rowValue} == null ? ${emptyText} : ${labelsVariableName}[` + `\`\${${rowValue}}\`` + `] ?? ${rowValue})`;

        return {
            textContent,
            variableDefinitions: [labelMappingVar],
        };
    }

    return {
        textContent: stringTextContent,
    };
};

export const getCombinationColumnRenderCell = (column: GridCombinationColumnConfig<string>, messageIdPrefix: string) => {
    const gridCellContentProps: Record<string, string> = {};
    const allVariableDefinitions: string[] = [];

    if (column.primaryText) {
        const { textContent, variableDefinitions = [] } = getTextForCellContent(column.primaryText, `${messageIdPrefix}.primaryText`, false);
        gridCellContentProps.primaryText = textContent;
        allVariableDefinitions.push(...variableDefinitions);
    }

    if (column.secondaryText) {
        const { textContent, variableDefinitions = [] } = getTextForCellContent(column.secondaryText, `${messageIdPrefix}.secondaryText`, false);
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

    if (textConfig.type === "group") {
        return textConfig.fields.flatMap((field) => getFieldNamesFromText(field));
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
