import { Field, type FieldProps } from "@comet/admin";

import { type DateRange } from "./DateRangePicker";
import { FinalFormDateRangePicker } from "./FinalFormDateRangePicker";

export type DateRangeFieldProps = FieldProps<DateRange, HTMLInputElement>;

export const DateRangeField = ({ ...restProps }: DateRangeFieldProps) => {
    return <Field component={FinalFormDateRangePicker} {...restProps} />;
};
