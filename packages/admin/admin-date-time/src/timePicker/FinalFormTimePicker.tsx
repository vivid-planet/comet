import { type FieldRenderProps } from "react-final-form";

import { TimePicker, type TimePickerProps } from "./TimePicker";

export type FinalFormTimePickerProps = TimePickerProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible TimePicker component.
 *
 * @see {@link TimeField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormTimePicker = ({ meta, input, ...restProps }: FinalFormTimePickerProps) => {
    return <TimePicker {...input} {...restProps} />;
};
