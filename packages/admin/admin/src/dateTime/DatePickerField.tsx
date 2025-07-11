import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { DatePicker, type DatePickerProps } from "./DatePicker";

const FinalFormDatePicker = ({ meta, input, ...restProps }: DatePickerProps & FieldRenderProps<string, HTMLInputElement>) => {
    return <DatePicker {...input} {...restProps} />;
};

export type DatePickerFieldProps = FieldProps<string, HTMLInputElement>;

export const DatePickerField = (props: DatePickerFieldProps) => {
    return <Field component={FinalFormDatePicker} {...props} />;
};
