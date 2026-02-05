import { type FieldRenderProps } from "react-final-form";

<<<<<<< HEAD:packages/admin/admin/src/dateTime/DatePickerField.tsx
import { Field, type FieldProps } from "../form/Field";
import { DatePicker, type DatePickerProps } from "./DatePicker";
=======
import { Field, type FieldProps } from "../../form/Field";
import { Future_DatePicker as DatePicker, type Future_DatePickerProps as DatePickerProps } from "../datePicker/DatePicker";
>>>>>>> main:packages/admin/admin/src/dateTime/datePickerField/DatePickerField.tsx

type FinalFormDatePickerProps = DatePickerProps;
const FinalFormDatePicker = ({ meta, input, ...restProps }: FinalFormDatePickerProps & FieldRenderProps<string, HTMLInputElement>) => {
    return <DatePicker {...input} {...restProps} />;
};

export type DatePickerFieldProps = FinalFormDatePickerProps & FieldProps<string, HTMLInputElement>;

<<<<<<< HEAD:packages/admin/admin/src/dateTime/DatePickerField.tsx
export const DatePickerField = (props: DatePickerFieldProps) => {
=======
/**
 * A Final Form field wrapper for the DatePicker component. This integrates the DatePicker with react-final-form,
 * providing automatic form state management, validation, and error handling.
 *
 * Use this component when working with Final Form. For standalone usage, use `DatePicker` instead.
 *
 * - [Storybook](https://storybook.comet-dxp.com/?path=/docs/@comet/admin_components-datetime-datepickerfield--docs)
 */
export const Future_DatePickerField = (props: Future_DatePickerFieldProps) => {
>>>>>>> main:packages/admin/admin/src/dateTime/datePickerField/DatePickerField.tsx
    return <Field component={FinalFormDatePicker} {...props} />;
};
