import { Field, type FieldProps } from "@comet/admin";

import { FinalFormTimePicker, type FinalFormTimePickerProps } from "./FinalFormTimePicker";

export type TimeFieldProps = FieldProps<string, HTMLInputElement> & FinalFormTimePickerProps;

/**
 * @deprecated `TimeField` from `@comet/admin-date-time` will be replaced by `TimePickerField` (currently `Future_TimePickerField`) from `@comet/admin` in a future major release.
 */
export const TimeField = ({ ...restProps }: TimeFieldProps) => {
    return <Field component={FinalFormTimePicker} {...restProps} />;
};
