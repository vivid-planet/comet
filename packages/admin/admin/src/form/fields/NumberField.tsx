import { Field, type FieldProps } from "../Field";
import { FinalFormNumberInput } from "../FinalFormNumberInput";

export type NumberFieldProps = FieldProps<number, HTMLInputElement>;

export const NumberField = ({ ...restProps }: NumberFieldProps) => {
    return <Field component={FinalFormNumberInput} {...restProps} />;
};
