import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { type DateTimeRange, DateTimeRangePicker, type DateTimeRangePickerProps } from "./DateTimeRangePicker";

const FinalFormDateTimeRangePicker = ({
    meta,
    input,
    ...restProps
}: DateTimeRangePickerProps & FieldRenderProps<DateTimeRange, HTMLInputElement>) => {
    return <DateTimeRangePicker {...input} {...restProps} />;
};

export type DateTimeRangePickerFieldProps = FieldProps<DateTimeRange, HTMLInputElement>;

export const DateTimeRangePickerField = (props: DateTimeRangePickerFieldProps) => {
    return <Field component={FinalFormDateTimeRangePicker} {...props} />;
};
