import { FieldRenderProps } from "react-final-form";

import { DateTimePicker, DateTimePickerProps } from "./DateTimePicker";

export type FinalFormDateTimePickerProps = DateTimePickerProps & FieldRenderProps<Date, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormDateTimePicker = ({ meta, input, ...restProps }: FinalFormDateTimePickerProps) => {
    return <DateTimePicker {...input} {...restProps} />;
};
