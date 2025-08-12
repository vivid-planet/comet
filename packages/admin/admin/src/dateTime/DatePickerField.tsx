import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { Future_DatePicker as DatePicker, type Future_DatePickerProps as DatePickerProps } from "./DatePicker";

const FinalFormDatePicker = ({ meta, input, ...restProps }: DatePickerProps & FieldRenderProps<string, HTMLInputElement>) => {
    return <DatePicker {...input} {...restProps} />;
};

export type Future_DatePickerFieldProps<FormValues> = FieldProps<FormValues, string, HTMLInputElement>;

export function Future_DatePickerField<FormValues>(props: Future_DatePickerFieldProps<FormValues>) {
    return <Field component={FinalFormDatePicker} {...props} />;
}
