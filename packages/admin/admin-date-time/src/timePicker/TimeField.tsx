import { Field, type FieldProps } from "@comet/admin";

import { FinalFormTimePicker } from "./FinalFormTimePicker";

export type TimeFieldProps = FieldProps<string, HTMLInputElement>;

export const TimeField = ({ ...restProps }: TimeFieldProps) => {
    return <Field component={FinalFormTimePicker} {...restProps} />;
};
