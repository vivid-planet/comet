import { ComponentProps } from "react";
import { FormattedNumber } from "react-intl";

export const getFormattedMessageNode = (id: string, defaultMessage: string, values?: string) => {
    if (defaultMessage === "") {
        return '""';
    }
    return `<FormattedMessage id="${id}" defaultMessage={\`${defaultMessage}\`} ${values ? `values={${values}}` : ""} />`;
};

export const getFormattedMessageString = (id: string, defaultMessage: string, values?: string) => {
    if (defaultMessage === "") {
        return '""';
    }
    return `intl.formatMessage({ id: "${id}", defaultMessage: \`${defaultMessage}\`${values ? `, values: {${values}}` : ""}})`;
};

export type FormattedNumberOptions = {
    [K in keyof Omit<ComponentProps<typeof FormattedNumber>, "value">]: unknown;
};

export const getFormattedNumberNode = (value: string, options: FormattedNumberOptions) => {
    return `<FormattedNumber value={${value}} ${Object.entries(options)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${typeof value === "string" ? `"${value}"` : `{${value}}`}`)
        .join(" ")} />`;
};

export const getFormattedNumberString = (value: string, options: FormattedNumberOptions) => {
    return `intl.formatNumber(${value}, ${JSON.stringify(options)})`;
};
