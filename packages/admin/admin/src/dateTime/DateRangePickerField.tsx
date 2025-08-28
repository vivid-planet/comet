import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import {
    type DateRange,
    Future_DateRangePicker as DateRangePicker,
    type Future_DateRangePickerProps as DateRangePickerProps,
} from "./DateRangePicker";

const FinalFormDateRangePicker = ({ meta, input, ...restProps }: DateRangePickerProps & FieldRenderProps<DateRange, HTMLInputElement>) => {
    return <DateRangePicker {...input} {...restProps} />;
};

export type Future_DateRangePickerFieldProps = FieldProps<DateRange, HTMLInputElement>;

export const Future_DateRangePickerField = (props: Future_DateRangePickerFieldProps) => {
    return <Field component={FinalFormDateRangePicker} {...props} />;
};
