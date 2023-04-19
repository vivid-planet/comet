import { Field, FieldProps } from "@comet/admin";
import * as React from "react";

import { FinalFormTimeRangePicker } from "../FinalFormTimeRangePicker";
import { TimeRange } from "../TimeRangePicker";

export type TimeRangeFieldProps = FieldProps<TimeRange, HTMLInputElement>;

export const TimeRangeField = ({ ...restProps }: TimeRangeFieldProps): React.ReactElement => {
    return <Field component={FinalFormTimeRangePicker} {...restProps} />;
};
