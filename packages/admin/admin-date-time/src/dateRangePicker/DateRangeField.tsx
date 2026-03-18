import { Field, type FieldProps } from "@comet/admin";

import { type DateRange } from "./DateRangePicker";
import { FinalFormDateRangePicker, type FinalFormDateRangePickerProps } from "./FinalFormDateRangePicker";

export type DateRangeFieldProps = FieldProps<DateRange, HTMLInputElement> & FinalFormDateRangePickerProps;

/**
 * @deprecated Use `DateRangePickerField` from `@comet/admin` instead.
 */
export const DateRangeField = ({ ...restProps }: DateRangeFieldProps) => {
    return <Field component={FinalFormDateRangePicker} {...restProps} />;
};
