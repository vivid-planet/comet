import { Field, type FieldProps } from "../Field";
import { FinalFormNumberInput, type FinalFormNumberInputProps } from "../FinalFormNumberInput";

export type NumberFieldProps = FieldProps<number, HTMLInputElement> & FinalFormNumberInputProps;

export const NumberField = ({ ...restProps }: NumberFieldProps) => {
    return <Field component={FinalFormNumberInput} {...restProps} />;
};
