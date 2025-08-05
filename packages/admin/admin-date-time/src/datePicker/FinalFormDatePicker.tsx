import { type FieldRenderProps } from "react-final-form";

import { DatePicker, type DatePickerProps } from "./DatePicker";

export type FinalFormDatePickerProps = DatePickerProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible DatePicker component.
 *
 * @see {@link DateField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormDatePicker = ({ meta, input, ...restProps }: FinalFormDatePickerProps) => {
    return <DatePicker {...input} {...restProps} />;
};
