import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormCurrencyInput } from "../FinalFormCurrencyInput";

export type CurrencyFieldProps = FieldProps<string, HTMLInputElement>;

export const CurrencyField = ({ ...restProps }: CurrencyFieldProps): React.ReactElement => {
    return <Field component={FinalFormCurrencyInput} {...restProps} />;
};
