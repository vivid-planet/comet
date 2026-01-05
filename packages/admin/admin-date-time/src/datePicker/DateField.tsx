import { Field, type FieldProps } from "@comet/admin";

import { FinalFormDatePicker, type FinalFormDatePickerProps } from "./FinalFormDatePicker";

export type DateFieldProps = FieldProps<Date, HTMLInputElement> & FinalFormDatePickerProps;

/**
 * @deprecated Use `DatePickerField` from `@comet/admin` instead.
 */
export const DateField = ({ ...restProps }: DateFieldProps) => {
    return <Field component={FinalFormDatePicker} {...restProps} />;
};
