import { Field, type FieldProps } from "@comet/admin";

import { FinalFormTimePicker } from "./FinalFormTimePicker";

export type TimeFieldProps<FormValues> = FieldProps<FormValues, string, HTMLInputElement>;

export function TimeField<FormValues>({ ...restProps }: TimeFieldProps<FormValues>) {
    return <Field component={FinalFormTimePicker} {...restProps} />;
}
