import { type ReactNode } from "react";

import { Field, type FieldProps } from "../Field";
import { FinalFormAsyncSelect } from "../FinalFormAsyncSelect";

export interface AsyncSelectFieldProps<Option> extends FieldProps<Option, HTMLSelectElement> {
    loadOptions: () => Promise<Option[]>;
    noOptionsLabel?: ReactNode;
    getOptionLabel?: (option: Option) => string;
    getOptionValue?: (option: Option) => string;
    clearable?: boolean;
}

export function AsyncSelectField<Option>(props: AsyncSelectFieldProps<Option>) {
    return <Field component={FinalFormAsyncSelect} {...props} />;
}
