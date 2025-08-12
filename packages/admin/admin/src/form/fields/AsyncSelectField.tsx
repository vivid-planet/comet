import { type ReactNode } from "react";

import { Field, type FieldProps } from "../Field";
import { FinalFormAsyncSelect } from "../FinalFormAsyncSelect";

export interface AsyncSelectFieldProps<FormValues, Option> extends FieldProps<FormValues, Option, HTMLSelectElement> {
    loadOptions: () => Promise<Option[]>;
    noOptionsLabel?: ReactNode;
    errorLabel?: ReactNode;
    getOptionLabel?: (option: Option) => string;
    getOptionValue?: (option: Option) => string;
    clearable?: boolean;
}

export function AsyncSelectField<FormValues, Option>(props: AsyncSelectFieldProps<FormValues, Option>) {
    return <Field component={FinalFormAsyncSelect} {...props} />;
}
