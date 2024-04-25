import { InputBase, InputBaseProps } from "@mui/material";
import * as React from "react";
import { forwardRef } from "react";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

export type FinalFormCurrencyInputProps = InputBaseProps &
    CurrencyInputProps &
    FieldRenderProps<number, HTMLInputElement> & {
        clearable?: boolean;
    };

const customInput = forwardRef<HTMLInputElement, FinalFormCurrencyInputProps>((props: FinalFormCurrencyInputProps, ref) => {
    return <InputBase inputRef={ref} {...props} />;
});

export function FinalFormCurrencyInput({
    meta,
    input,
    innerRef,
    clearable,
    endAdornment,
    currency,
    ...props
}: FinalFormCurrencyInputProps): React.ReactElement {
    const intl = useIntl();

    return <CurrencyInput decimalsLimit={2} customInput={customInput} intlConfig={{ locale: intl.locale, currency: currency }} />;
}
