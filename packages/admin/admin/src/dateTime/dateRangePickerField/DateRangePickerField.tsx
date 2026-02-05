import { type FieldRenderProps } from "react-final-form";

<<<<<<< HEAD:packages/admin/admin/src/dateTime/DateRangePickerField.tsx
import { Field, type FieldProps } from "../form/Field";
import { type DateRange, DateRangePicker as DateRangePicker, type DateRangePickerProps as DateRangePickerProps } from "./DateRangePicker";
=======
import { Field, type FieldProps } from "../../form/Field";
import {
    type DateRange,
    Future_DateRangePicker as DateRangePicker,
    type Future_DateRangePickerProps as DateRangePickerProps,
} from "../dateRangePicker/DateRangePicker";
>>>>>>> main:packages/admin/admin/src/dateTime/dateRangePickerField/DateRangePickerField.tsx

const FinalFormDateRangePicker = ({ meta, input, ...restProps }: DateRangePickerProps & FieldRenderProps<DateRange, HTMLInputElement>) => {
    return <DateRangePicker {...input} {...restProps} />;
};

export type DateRangePickerFieldProps = FieldProps<DateRange, HTMLInputElement>;

<<<<<<< HEAD:packages/admin/admin/src/dateTime/DateRangePickerField.tsx
export const DateRangePickerField = (props: DateRangePickerFieldProps) => {
=======
/**
 * A Final Form field wrapper for the DateRangePicker component. This integrates the DateRangePicker with react-final-form,
 * providing automatic form state management, validation, and error handling.
 *
 * Use this component when working with Final Form. For standalone usage, use `DateRangePicker` instead.
 *
 * - [Storybook](https://storybook.comet-dxp.com/?path=/docs/@comet/admin_components-datetime-daterangepickerfield--docs)
 */
export const Future_DateRangePickerField = (props: Future_DateRangePickerFieldProps) => {
>>>>>>> main:packages/admin/admin/src/dateTime/dateRangePickerField/DateRangePickerField.tsx
    return <Field component={FinalFormDateRangePicker} {...props} />;
};
