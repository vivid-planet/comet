import { type FieldRenderProps } from "react-final-form";

import { DatePicker, type DatePickerProps } from "./DatePicker";

export type FinalFormDatePickerProps = DatePickerProps;

type FinalFormDatePickerInternalProps = FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

/**
 * @deprecated `FinalFormDatePicker` from `@comet/admin-date-time` will be replaced by `DatePickerField` (currently `Future_DatePickerField`) from `@comet/admin` in a future major release.
 *
 * Final Form-compatible DatePicker component.
 *
 * @see {@link DateField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormDatePicker = ({ meta, input, ...restProps }: FinalFormDatePickerProps & FinalFormDatePickerInternalProps) => {
    return <DatePicker {...input} {...restProps} />;
};
