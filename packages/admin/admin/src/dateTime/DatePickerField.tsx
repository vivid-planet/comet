import { type FieldRenderProps } from "react-final-form";

import { Field, type FieldProps } from "../form/Field";
import { Future_DatePicker as DatePicker, type Future_DatePickerProps as DatePickerProps } from "./DatePicker";

type FinalFormDatePickerProps = DatePickerProps;

const FinalFormDatePicker = ({ meta, input, ...restProps }: FinalFormDatePickerProps & FieldRenderProps<string, HTMLInputElement>) => {
    const { onChange, ...restInput } = input;

    const hadValueInitially = Boolean(meta.initial);
    const clearValue = hadValueInitially ? null : meta.initial;

    return (
        <DatePicker
            {...restInput}
            {...restProps}
            onChange={(value) => {
                if (value === null || value === undefined) {
                    onChange(clearValue);
                    return;
                }

                onChange(value);
            }}
        />
    );
};

export type Future_DatePickerFieldProps = FinalFormDatePickerProps & FieldProps<string, HTMLInputElement>;

export const Future_DatePickerField = (props: Future_DatePickerFieldProps) => {
    return <Field component={FinalFormDatePicker} {...props} />;
};
