import { type FieldRenderProps } from "react-final-form";

import { TimePicker, type TimePickerProps } from "./TimePicker";

export type FinalFormTimePickerProps = TimePickerProps;
type FinalFormTimePickerInternalProps = FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

/**
 * @deprecated `FinalFormTimePicker` from `@comet/admin-date-time` will be replaced by `TimePickerField` (currently `Future_TimePickerField`) from `@comet/admin` in a future major release.
 *
 * Final Form-compatible TimePicker component.
 *
 * @see {@link TimeField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormTimePicker = ({ meta, input, ...restProps }: FinalFormTimePickerProps & FinalFormTimePickerInternalProps) => {
    return <TimePicker {...input} {...restProps} />;
};
