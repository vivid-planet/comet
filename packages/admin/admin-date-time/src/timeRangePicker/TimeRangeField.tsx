import { Field, type FieldProps } from "@comet/admin";

import { FinalFormTimeRangePicker } from "./FinalFormTimeRangePicker";
import { type TimeRange } from "./TimeRangePicker";

export type TimeRangeFieldProps = FieldProps<TimeRange, HTMLInputElement>;

export const TimeRangeField = ({ ...restProps }: TimeRangeFieldProps) => {
    return <Field component={FinalFormTimeRangePicker} {...restProps} />;
};
