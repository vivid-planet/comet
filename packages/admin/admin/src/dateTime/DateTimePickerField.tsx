import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { Future_DateTimePicker as DateTimePicker, type Future_DateTimePickerProps as DateTimePickerProps } from "./DateTimePicker";

const FinalFormDateTimePicker = ({ meta, input, ...restProps }: DateTimePickerProps & FieldRenderProps<Date, HTMLInputElement>) => {
    return <DateTimePicker {...input} {...restProps} />;
};

export type Future_DateTimePickerFieldProps = FieldProps<Date, HTMLInputElement>;

export const Future_DateTimePickerField = (props: Future_DateTimePickerFieldProps) => {
    return <Field component={FinalFormDateTimePicker} {...props} />;
};
