import { FunctionComponent, ReactNode } from "react";

import { ReadOnlyDateField } from "./ReadOnlyDateField";
import { ReadOnlyFileField } from "./ReadOnlyFileField";
import { ReadOnlyMultiSelectField } from "./ReadOnlyMultiSelectField";
import { ReadOnlyNumberField } from "./ReadOnlyNumberField";
import { ReadOnlyRichTextField } from "./ReadOnlyRichTextField";
import { ReadOnlySelectField } from "./ReadOnlySelectField";
import { ReadOnlySwitchField } from "./ReadOnlySwitchField";
import { ReadOnlyTextAreaField } from "./ReadOnlyTextAreaField";
import { ReadOnlyTextField } from "./ReadOnlyTextField";

export type ReadOnlyFieldType = "text" | "textarea" | "richtext" | "number" | "switch" | "date" | "file" | "block" | "select" | "multiselect";

const isSelectOption = (val: unknown): val is { label: ReactNode; value: string | number } =>
    !!val && typeof val === "object" && "label" in val && "value" in val;

const inferType = (value: unknown): ReadOnlyFieldType => {
    if (Array.isArray(value)) {
        if (value.every(isSelectOption)) return "multiselect";
        if (value.every((v) => v instanceof File)) return "file";
    }
    if (isSelectOption(value)) return "select";
    if (value instanceof Date) return "date";
    if (value instanceof File) return "file";
    if (typeof value === "boolean") return "switch";
    if (typeof value === "number") return "number";
    if (typeof value === "string") return "text";
    return "block";
};

export interface ReadOnlyFieldProps {
    label?: ReactNode;
    value: any;
    type?: ReadOnlyFieldType;
    className?: string;
}

export const ReadOnlyField: FunctionComponent<ReadOnlyFieldProps> = ({ label, value, type, className }) => {
    const effectiveType = type ?? inferType(value);
    const restProps = { label, value, className };

    switch (effectiveType) {
        case "text":
            return <ReadOnlyTextField {...restProps} />;
        case "textarea":
            return <ReadOnlyTextAreaField {...restProps} />;
        case "richtext":
            return <ReadOnlyRichTextField {...restProps} />;
        case "number":
            return <ReadOnlyNumberField {...restProps} />;
        case "switch":
            return <ReadOnlySwitchField {...restProps} />;
        case "date":
            return <ReadOnlyDateField {...restProps} />;
        case "file":
            return <ReadOnlyFileField {...restProps} />;
        case "block":
            return null; // TODO: Implement ReadOnlyBlockField. At the moment, we have a problem because we don't have access to BlockPreviewContent function.
        case "select":
            return <ReadOnlySelectField {...restProps} />;
        case "multiselect":
            return <ReadOnlyMultiSelectField {...restProps} />;
        default:
            return null;
    }
};
