import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { TimePicker, type TimePickerProps as TimePickerProps } from "./TimePicker";

const FinalFormTimePicker = ({ meta, input, ...restProps }: TimePickerProps & FieldRenderProps<string, HTMLInputElement>) => {
    return <TimePicker {...input} {...restProps} />;
};

export type TimePickerFieldProps = FieldProps<string, HTMLInputElement>;

export const TimePickerField = (props: TimePickerFieldProps) => {
    return <Field component={FinalFormTimePicker} {...props} />;
};
