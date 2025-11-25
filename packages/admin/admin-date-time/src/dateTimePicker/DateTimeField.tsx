import { Field, type FieldProps } from "@comet/admin";

import { FinalFormDateTimePicker, type FinalFormDateTimePickerProps } from "./FinalFormDateTimePicker";

export type DateTimeFieldProps = FieldProps<Date, HTMLInputElement> & FinalFormDateTimePickerProps;

/**
 * @deprecated `DateTimeField` from `@comet/admin-date-time` will be replaced by `DateTimePickerField` (currently `Future_DateTimePickerField`) from `@comet/admin` in a future major release.
 */
export const DateTimeField = ({ ...restProps }: DateTimeFieldProps) => {
    return <Field component={FinalFormDateTimePicker} {...restProps} />;
};
