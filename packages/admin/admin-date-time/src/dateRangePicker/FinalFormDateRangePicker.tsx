import { type FieldRenderProps } from "react-final-form";

import { type DateRange, DateRangePicker, type DateRangePickerProps } from "./DateRangePicker";

export type FinalFormDateRangePickerProps = DateRangePickerProps & FieldRenderProps<DateRange, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible DateRangerPicker component.
 *
 * @see {@link DateRangeField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormDateRangePicker = ({ meta, input, ...restProps }: FinalFormDateRangePickerProps) => {
    return <DateRangePicker {...input} {...restProps} />;
};
