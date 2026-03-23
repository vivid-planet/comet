import { Field, type FieldProps } from "@comet/admin";

import { FinalFormTimePicker, type FinalFormTimePickerProps } from "./FinalFormTimePicker";

export type TimeFieldProps = FieldProps<string, HTMLInputElement> & FinalFormTimePickerProps;

/**
 * @deprecated Use `TimePickerField` from `@comet/admin` instead.
 */
export const TimeField = ({ ...restProps }: TimeFieldProps) => {
    return <Field component={FinalFormTimePicker} {...restProps} />;
};
