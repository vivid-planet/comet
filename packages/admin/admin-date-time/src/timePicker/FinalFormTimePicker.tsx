import { FieldRenderProps } from "react-final-form";

import { TimePicker, TimePickerProps } from "./TimePicker";

export type FinalFormTimePickerProps = TimePickerProps & FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement>;

export const FinalFormTimePicker = ({ meta, input, ...restProps }: FinalFormTimePickerProps) => {
    return <TimePicker {...input} {...restProps} />;
};
