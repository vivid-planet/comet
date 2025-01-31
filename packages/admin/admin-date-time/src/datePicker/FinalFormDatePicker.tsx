import { type FieldRenderProps } from "react-final-form";

import { DatePicker, type DatePickerProps } from "./DatePicker";

export type FinalFormDatePickerProps = DatePickerProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormDatePicker = ({ meta, input, ...restProps }: FinalFormDatePickerProps) => {
    return <DatePicker {...input} {...restProps} />;
};
