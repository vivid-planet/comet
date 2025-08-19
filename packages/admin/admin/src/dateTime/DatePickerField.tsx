import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { Future_DatePicker as DatePicker, type Future_DatePickerProps as DatePickerProps } from "./DatePicker";

type FinalFormDatePickerProps = DatePickerProps;
const FinalFormDatePicker = ({ meta, input, ...restProps }: FinalFormDatePickerProps & FieldRenderProps<string, HTMLInputElement>) => {
    return <DatePicker {...input} {...restProps} />;
};

export type Future_DatePickerFieldProps = FinalFormDatePickerProps & FieldProps<string, HTMLInputElement>;

export const Future_DatePickerField = (props: Future_DatePickerFieldProps) => {
    return <Field component={FinalFormDatePicker} {...props} />;
};
