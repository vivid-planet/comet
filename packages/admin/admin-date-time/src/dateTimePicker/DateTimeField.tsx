import { Field, type FieldProps } from "@comet/admin";

import { FinalFormDateTimePicker } from "./FinalFormDateTimePicker";

export type DateTimeFieldProps<FormValues> = FieldProps<FormValues, Date, HTMLInputElement>;

export function DateTimeField<FormValues>({ ...restProps }: DateTimeFieldProps<FormValues>) {
    return <Field component={FinalFormDateTimePicker} {...restProps} />;
}
