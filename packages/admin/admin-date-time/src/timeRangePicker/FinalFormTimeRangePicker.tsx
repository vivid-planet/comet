import { type FieldRenderProps } from "react-final-form";

import { type TimeRange, TimeRangePicker, type TimeRangePickerProps } from "./TimeRangePicker";

export type FinalFormTimeRangePickerProps = TimeRangePickerProps & FieldRenderProps<TimeRange, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormTimeRangePicker = ({ meta, input, ...restProps }: FinalFormTimeRangePickerProps) => {
    return <TimeRangePicker {...input} {...restProps} />;
};
