import { type FieldRenderProps } from "react-final-form";

import { TimePicker, type TimePickerProps } from "./TimePicker";

export type FinalFormTimePickerProps = TimePickerProps;
type FinalFormTimePickerInternalProps = FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

/**
 * @deprecated Use `TimePickerField` from `@comet/admin` instead.
 *
 * Final Form-compatible TimePicker component.
 *
 * @see {@link TimeField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormTimePicker = ({ meta, input, ...restProps }: FinalFormTimePickerProps & FinalFormTimePickerInternalProps) => {
    return <TimePicker {...input} {...restProps} />;
};
