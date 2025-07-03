import { type FieldRenderProps } from "react-final-form";

import { type TimeRange, TimeRangePicker, type TimeRangePickerProps } from "./TimeRangePicker";

export type FinalFormTimeRangePickerProps = TimeRangePickerProps & FieldRenderProps<TimeRange, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible TimeRangePicker component.
 *
 * @see {@link TimeRangeField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormTimeRangePicker = ({ meta, input, ...restProps }: FinalFormTimeRangePickerProps) => {
    return <TimeRangePicker {...input} {...restProps} />;
};
