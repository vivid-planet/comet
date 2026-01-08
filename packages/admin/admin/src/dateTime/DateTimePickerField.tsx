import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { DateTimePicker as DateTimePicker, type DateTimePickerProps as DateTimePickerProps } from "./DateTimePicker";

const FinalFormDateTimePicker = ({ meta, input, ...restProps }: DateTimePickerProps & FieldRenderProps<Date, HTMLInputElement>) => {
    return <DateTimePicker {...input} {...restProps} />;
};

export type DateTimePickerFieldProps = FieldProps<Date, HTMLInputElement>;

export const DateTimePickerField = (props: DateTimePickerFieldProps) => {
    return <Field component={FinalFormDateTimePicker} {...props} />;
};
