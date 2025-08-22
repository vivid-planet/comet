import { Field, type FieldProps } from "@comet/admin";

import { FinalFormDateTimePicker, type FinalFormDateTimePickerProps } from "./FinalFormDateTimePicker";

export type DateTimeFieldProps = FieldProps<Date, HTMLInputElement> & FinalFormDateTimePickerProps;

export const DateTimeField = ({ ...restProps }: DateTimeFieldProps) => {
    return <Field component={FinalFormDateTimePicker} {...restProps} />;
};
