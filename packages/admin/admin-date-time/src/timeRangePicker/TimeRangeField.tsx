import { Field, type FieldProps } from "@comet/admin";

import { FinalFormTimeRangePicker, type FinalFormTimeRangePickerProps } from "./FinalFormTimeRangePicker";
import { type TimeRange } from "./TimeRangePicker";

export type TimeRangeFieldProps = FieldProps<TimeRange, HTMLInputElement> & FinalFormTimeRangePickerProps;

export const TimeRangeField = ({ ...restProps }: TimeRangeFieldProps) => {
    return <Field component={FinalFormTimeRangePicker} {...restProps} />;
};
