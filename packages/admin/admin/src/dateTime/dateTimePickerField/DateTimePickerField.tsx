import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../../form/Field";
import { Future_DateTimePicker as DateTimePicker, type Future_DateTimePickerProps as DateTimePickerProps } from "../dateTimePicker/DateTimePicker";

const FinalFormDateTimePicker = ({ meta, input, ...restProps }: DateTimePickerProps & FieldRenderProps<Date, HTMLInputElement>) => {
    return <DateTimePicker {...input} {...restProps} />;
};

export type Future_DateTimePickerFieldProps = FieldProps<Date, HTMLInputElement>;

/**
 * A Final Form field wrapper for the DateTimePicker component. This integrates the DateTimePicker with react-final-form,
 * providing automatic form state management, validation, and error handling.
 *
 * Use this component when working with Final Form. For standalone usage, use `DateTimePicker` instead.
 *
 * - [Storybook](https://storybook.comet-dxp.com/?path=/docs/@comet/admin_components-datetime-datetimepickerfield--docs)
 */
export const Future_DateTimePickerField = (props: Future_DateTimePickerFieldProps) => {
    return <Field component={FinalFormDateTimePicker} {...props} />;
};
