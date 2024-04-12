import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormCurrencyInput } from "../FinalFormCurrencyInput";

export interface CurrencyFieldProps extends FieldProps<string, HTMLInputElement> {
    currencySign: string;
    currencySignPosition: "before" | "after";
}

export const CurrencyField = ({ ...restProps }: CurrencyFieldProps): React.ReactElement => {
    return <Field component={FinalFormCurrencyInput} {...restProps} />;
};
