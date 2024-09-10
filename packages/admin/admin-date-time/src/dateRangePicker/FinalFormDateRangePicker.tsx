import { FieldRenderProps } from "react-final-form";

import { DateRange, DateRangePicker, DateRangePickerProps } from "./DateRangePicker";

export type FinalFormDateRangePickerProps = DateRangePickerProps & FieldRenderProps<DateRange, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormDateRangePicker = ({ meta, input, ...restProps }: FinalFormDateRangePickerProps) => {
    return <DateRangePicker {...input} {...restProps} />;
};
