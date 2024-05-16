import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormNumberInput } from "../FinalFormNumberInput";

export const NumberField = ({ ...restProps }: FieldProps) => {
    return <Field component={FinalFormNumberInput} {...restProps} />;
};
