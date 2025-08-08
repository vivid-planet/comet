import { Field, type FieldProps } from "@comet/admin";

import { FinalFormDatePicker } from "./FinalFormDatePicker";

export type DateFieldProps<FormValues> = FieldProps<FormValues, Date, HTMLInputElement>;

/**
 * @deprecated `DateField` from `@comet/admin-date-time` will be replaced by `DatePickerField` (currently `Future_DatePickerField`) from `@comet/admin` in a future major release.
 */
export function DateField<FormValues>({ ...restProps }: DateFieldProps<FormValues>) {
    return <Field component={FinalFormDatePicker} {...restProps} />;
}
