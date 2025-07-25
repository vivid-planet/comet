import { type FieldRenderProps } from "react-final-form";

import { DateTimePicker, type DateTimePickerProps } from "./DateTimePicker";

export type FinalFormDateTimePickerProps = DateTimePickerProps & FieldRenderProps<Date, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible DateTimePicker component.
 *
 * @see {@link DateTimeField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormDateTimePicker = ({ meta, input, ...restProps }: FinalFormDateTimePickerProps) => {
    return <DateTimePicker {...input} {...restProps} />;
};
