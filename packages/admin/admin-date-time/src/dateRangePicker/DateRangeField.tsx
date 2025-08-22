import { Field, type FieldProps } from "@comet/admin";

import { type DateRange } from "./DateRangePicker";
import { FinalFormDateRangePicker, type FinalFormDateRangePickerProps } from "./FinalFormDateRangePicker";

export type DateRangeFieldProps = FieldProps<DateRange, HTMLInputElement> & FinalFormDateRangePickerProps;

/**
 * @deprecated `DateRangeField` from `@comet/admin-date-time` will be replaced by `DateRangePickerField` (currently `Future_DateRangePickerField`) from `@comet/admin` in a future major release.
 */
export const DateRangeField = ({ ...restProps }: DateRangeFieldProps) => {
    return <Field component={FinalFormDateRangePicker} {...restProps} />;
};
