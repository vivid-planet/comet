import { FieldRenderProps } from "react-final-form";

import { DatePicker, DatePickerProps } from "./DatePicker";

export type FinalFormDatePickerProps = DatePickerProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormDatePicker = ({ meta, input, ...restProps }: FinalFormDatePickerProps) => {
    return <DatePicker {...input} {...restProps} />;
};
