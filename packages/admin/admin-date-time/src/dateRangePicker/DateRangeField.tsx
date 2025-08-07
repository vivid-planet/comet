import { Field, type FieldProps } from "@comet/admin";

import { type DateRange } from "./DateRangePicker";
import { FinalFormDateRangePicker } from "./FinalFormDateRangePicker";

export type DateRangeFieldProps<FormValues> = FieldProps<FormValues, DateRange, HTMLInputElement>;

export function DateRangeField<FormValues>({ ...restProps }: DateRangeFieldProps<FormValues>) {
    return <Field component={FinalFormDateRangePicker} {...restProps} />;
}
