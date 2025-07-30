import { Field, type FieldProps } from "@comet/admin";

import { FinalFormDateTimePicker } from "./FinalFormDateTimePicker";

export type DateTimeFieldProps = FieldProps<Date, HTMLInputElement>;

export const DateTimeField = ({ ...restProps }: DateTimeFieldProps) => {
    return <Field component={FinalFormDateTimePicker} {...restProps} />;
};
