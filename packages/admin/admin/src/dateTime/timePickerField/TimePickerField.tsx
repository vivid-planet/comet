import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../../form/Field";
import { Future_TimePicker as TimePicker, type Future_TimePickerProps as TimePickerProps } from "../timePicker/TimePicker";

const FinalFormTimePicker = ({ meta, input, ...restProps }: TimePickerProps & FieldRenderProps<string, HTMLInputElement>) => {
    return <TimePicker {...input} {...restProps} />;
};

export type Future_TimePickerFieldProps = FieldProps<string, HTMLInputElement>;

/**
 * A Final Form field wrapper for the TimePicker component. This integrates the TimePicker with react-final-form,
 * providing automatic form state management, validation, and error handling.
 *
 * Use this component when working with Final Form. For standalone usage, use `TimePicker` instead.
 *
 * - [Storybook](https://storybook.comet-dxp.com/?path=/docs/@comet/admin_components-datetime-timepickerfield--docs)
 */
export const Future_TimePickerField = (props: Future_TimePickerFieldProps) => {
    return <Field component={FinalFormTimePicker} {...props} />;
};
