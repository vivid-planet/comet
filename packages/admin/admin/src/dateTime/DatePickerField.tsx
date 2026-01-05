import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { DatePicker, type DatePickerProps } from "./DatePicker";

type FinalFormDatePickerProps = DatePickerProps;
const FinalFormDatePicker = ({ meta, input, ...restProps }: FinalFormDatePickerProps & FieldRenderProps<string, HTMLInputElement>) => {
    return <DatePicker {...input} {...restProps} />;
};

export type DatePickerFieldProps = FinalFormDatePickerProps & FieldProps<string, HTMLInputElement>;

export const DatePickerField = (props: DatePickerFieldProps) => {
    return <Field component={FinalFormDatePicker} {...props} />;
};
