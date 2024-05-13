import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormCurrencyInput } from "../FinalFormCurrencyInput";

export const CurrencyField = ({ ...restProps }: FieldProps): React.ReactElement => {
    return <Field component={FinalFormCurrencyInput} {...restProps} />;
};
