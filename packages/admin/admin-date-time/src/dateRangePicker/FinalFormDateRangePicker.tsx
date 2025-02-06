import { type FieldRenderProps } from "react-final-form";

import { type DateRange, DateRangePicker, type DateRangePickerProps } from "./DateRangePicker";

export type FinalFormDateRangePickerProps = DateRangePickerProps & FieldRenderProps<DateRange, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormDateRangePicker = ({ meta, input, ...restProps }: FinalFormDateRangePickerProps) => {
    return <DateRangePicker {...input} {...restProps} />;
};
