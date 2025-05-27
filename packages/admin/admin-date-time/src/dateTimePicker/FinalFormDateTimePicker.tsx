import { type FieldRenderProps } from "react-final-form";

import { DateTimePicker, type DateTimePickerProps } from "./DateTimePicker";

export type FinalFormDateTimePickerProps = DateTimePickerProps & FieldRenderProps<Date, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormDateTimePicker = ({ meta, input, ...restProps }: FinalFormDateTimePickerProps) => {
    return <DateTimePicker {...input} {...restProps} />;
};
