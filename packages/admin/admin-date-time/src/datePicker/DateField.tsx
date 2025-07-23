import { Field, type FieldProps } from "@comet/admin";

import { FinalFormDatePicker } from "./FinalFormDatePicker";

export type DateFieldProps = FieldProps<Date, HTMLInputElement>;

export const DateField = ({ ...restProps }: DateFieldProps) => {
    return <Field component={FinalFormDatePicker} {...restProps} />;
};
