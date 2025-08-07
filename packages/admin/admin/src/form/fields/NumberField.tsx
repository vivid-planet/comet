import { Field, type FieldProps } from "../Field";
import { FinalFormNumberInput } from "../FinalFormNumberInput";

export type NumberFieldProps<FormValues> = FieldProps<FormValues, number, HTMLInputElement>;

export function NumberField<FormValues>({ ...restProps }: NumberFieldProps<FormValues>) {
    return <Field component={FinalFormNumberInput} {...restProps} />;
}
