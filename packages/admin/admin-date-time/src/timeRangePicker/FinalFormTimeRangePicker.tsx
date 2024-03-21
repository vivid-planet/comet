import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { TimeRange, TimeRangePicker, TimeRangePickerProps } from "./TimeRangePicker";

export type FinalFormTimeRangePickerProps = TimeRangePickerProps & FieldRenderProps<TimeRange, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormTimeRangePicker = ({ meta, input, ...restProps }: FinalFormTimeRangePickerProps): React.ReactElement => {
    return <TimeRangePicker {...input} {...restProps} />;
};
