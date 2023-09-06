import { Field, FieldProps } from "@comet/admin";
import * as React from "react";

import { DateRange } from "../DateRangePicker";
import { FinalFormDateRangePicker } from "../FinalFormDateRangePicker";

export type DateRangeFieldProps = FieldProps<DateRange, HTMLInputElement>;

export const DateRangeField = ({ ...restProps }: DateRangeFieldProps): React.ReactElement => {
    return <Field component={FinalFormDateRangePicker} {...restProps} />;
};
