import { Field, type FieldProps } from "@comet/admin";

import { FinalFormDatePicker, type FinalFormDatePickerProps } from "./FinalFormDatePicker";

export type DateFieldProps = FieldProps<Date, HTMLInputElement> & FinalFormDatePickerProps;

/**
 * @deprecated `DateField` from `@comet/admin-date-time` will be replaced by `DatePickerField` (currently `Future_DatePickerField`) from `@comet/admin` in a future major release.
 */
export const DateField = ({ ...restProps }: DateFieldProps) => {
    return <Field component={FinalFormDatePicker} {...restProps} />;
};
