import { Field, type FieldProps } from "@comet/admin";

import { FinalFormTimeRangePicker } from "./FinalFormTimeRangePicker";
import { type TimeRange } from "./TimeRangePicker";

export type TimeRangeFieldProps<FormValues> = FieldProps<FormValues, TimeRange, HTMLInputElement>;

export function TimeRangeField<FormValues>({ ...restProps }: TimeRangeFieldProps<FormValues>) {
    return <Field component={FinalFormTimeRangePicker} {...restProps} />;
}
