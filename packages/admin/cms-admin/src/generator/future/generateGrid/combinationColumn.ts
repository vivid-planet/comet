import { DataGridSettings } from "../generator";

type AbstractField<FieldName extends string> = {
    field: FieldName;
    emptyValue?: string;
};

type StringField<FieldName extends string> = AbstractField<FieldName> & {
    type: "string";
};

type NumberField<FieldName extends string> = AbstractField<FieldName> & {
    type: "number";
    decimals?: number;
};

type CurrencyField<FieldName extends string> = AbstractField<FieldName> & {
    type: "currency";
    currency: string;
};

type StaticSelectField<FieldName extends string> = AbstractField<FieldName> & {
    type: "staticSelect";
    options: Array<{
        value: string | number | boolean;
        label: string;
    }>;
};

type StaticText = {
    type: "static";
    text: string;
};

type Field<FieldName extends string> =
    | StaticText
    | FieldName
    | StringField<FieldName>
    | NumberField<FieldName>
    | CurrencyField<FieldName>
    | StaticSelectField<FieldName>;

type FieldGroup<FieldName extends string> = {
    type: "group";
    fields: Array<Field<FieldName> | FieldGroup<FieldName>>;
    separator?: string;
};

type TextConfig<FieldName extends string> = Field<FieldName> | FieldGroup<FieldName>;

export type GridCombinationColumnConfig<FieldName extends string> = {
    type: "combination";
    name: string;
    primaryText?: TextConfig<FieldName>;
    secondaryText?: TextConfig<FieldName>;
} & DataGridSettings;

const getTextForCellContent = (textConfig: TextConfig<string>, messageIdPrefix: string) => {
    if (typeof textConfig === "string") {
        return `row.${textConfig}`;
    }

    if (textConfig.type === "string") {
        const textValue = `row.${textConfig.field.replace(/\./g, "?.")}`;

        if (textConfig.emptyValue) {
            return `${textValue} ?? <FormattedMessage id="${messageIdPrefix}.empty" defaultMessage="${textConfig.emptyValue}" />`;
        }

        return textValue;
    }

    if (textConfig.type === "static") {
        return `<FormattedMessage id="${messageIdPrefix}" defaultMessage="${textConfig.text}" />`;
    }

    throw new Error(`Type ${textConfig.type} is not yet implemented`);
};

export const getCombinationColumnRenderCell = (column: GridCombinationColumnConfig<string>, messageIdPrefix: string) => {
    const gridCellContenetProps: Record<string, string> = {};

    if (column.primaryText) {
        gridCellContenetProps.primaryText = getTextForCellContent(column.primaryText, `${messageIdPrefix}.primaryText`);
    }

    if (column.secondaryText) {
        gridCellContenetProps.secondaryText = getTextForCellContent(column.secondaryText, `${messageIdPrefix}.secondaryText`);
    }

    return `({ row }) => {
        return <GridCellContent ${Object.entries(gridCellContenetProps)
            .map(([key, value]) => `${key}={${value}}`)
            .join(" ")} />;
    }`;
};

const getFieldNamesFromText = (textConfig: TextConfig<string>): string[] => {
    if (typeof textConfig === "string") {
        return [textConfig];
    }

    if (textConfig.type === "string") {
        return [textConfig.field];
    }

    if (textConfig.type === "static") {
        return [];
    }

    throw new Error(`Type ${textConfig.type} is not yet implemented`);
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
