import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { Future_TimePicker as TimePicker, type Future_TimePickerProps as TimePickerProps } from "./TimePicker";

const FinalFormTimePicker = ({ meta, input, ...restProps }: TimePickerProps & FieldRenderProps<string, HTMLInputElement>) => {
    return <TimePicker {...input} {...restProps} />;
};

export type Future_TimePickerFieldProps = FieldProps<string, HTMLInputElement>;

export const Future_TimePickerField = (props: Future_TimePickerFieldProps) => {
    return <Field component={FinalFormTimePicker} {...props} />;
};
