import { Field, type FieldProps } from "@comet/admin";

import { FinalFormColorPicker } from "./FinalFormColorPicker";

export type ColorFieldProps<FormValues> = FieldProps<FormValues, string, HTMLInputElement>;

export function ColorField<FormValues>({ ...restProps }: ColorFieldProps<FormValues>) {
    return <Field component={FinalFormColorPicker} {...restProps} />;
}
