import { Field, type FieldProps } from "@comet/admin";

import { type DateRange } from "./DateRangePicker";
import { FinalFormDateRangePicker, type FinalFormDateRangePickerProps } from "./FinalFormDateRangePicker";

export type DateRangeFieldProps = FieldProps<DateRange, HTMLInputElement> & FinalFormDateRangePickerProps;

export const DateRangeField = ({ ...restProps }: DateRangeFieldProps) => {
    return <Field component={FinalFormDateRangePicker} {...restProps} />;
};
