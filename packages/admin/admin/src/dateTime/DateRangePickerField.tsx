import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { type DateRange, DateRangePicker as DateRangePicker, type DateRangePickerProps as DateRangePickerProps } from "./DateRangePicker";

const FinalFormDateRangePicker = ({ meta, input, ...restProps }: DateRangePickerProps & FieldRenderProps<DateRange, HTMLInputElement>) => {
    return <DateRangePicker {...input} {...restProps} />;
};

export type DateRangePickerFieldProps = FieldProps<DateRange, HTMLInputElement>;

export const DateRangePickerField = (props: DateRangePickerFieldProps) => {
    return <Field component={FinalFormDateRangePicker} {...props} />;
};
