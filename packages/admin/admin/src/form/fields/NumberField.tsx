import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormNumberInput } from "../FinalFormNumberInput";

export type NumberFieldProps = FieldProps<number, HTMLInputElement>;

export const NumberField = ({ ...restProps }: NumberFieldProps) => {
    return <Field component={FinalFormNumberInput} {...restProps} />;
};
