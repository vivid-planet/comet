import { Field, type FieldProps } from "@comet/admin";

import { FinalFormDatePicker } from "./FinalFormDatePicker";

export type DateFieldProps = FieldProps<Date, HTMLInputElement>;

/**
 * @deprecated `DateField` from `@comet/admin-date-time` will be replaced by `DatePickerField` (currently `Future_DatePickerField`) from `@comet/admin` in a future major release.
 */
export const DateField = ({ ...restProps }: DateFieldProps) => {
    return <Field component={FinalFormDatePicker} {...restProps} />;
};
