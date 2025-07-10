import { type FieldRenderProps } from "react-final-form";

import { LegacyDatePicker, type LegacyDatePickerProps } from "./LegacyDatePicker";

export type FinalFormLegacyDatePickerProps = LegacyDatePickerProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible DatePicker component.
 *
 * @see {@link LegacyDateField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormLegacyDatePicker = ({ meta, input, ...restProps }: FinalFormLegacyDatePickerProps) => {
    return <LegacyDatePicker {...input} {...restProps} />;
};
