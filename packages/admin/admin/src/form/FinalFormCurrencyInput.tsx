import { InputBase, InputBaseProps } from "@mui/material";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";

export type FinalFormCurrencyInputProps = InputBaseProps &
    FieldRenderProps<number> & {
        clearable?: boolean;
    };

export function FinalFormCurrencyInput({
    meta,
    input,
    innerRef,
    clearable,
    endAdornment,
    disableContentTranslation,
    currencySign,
    currencySignPosition,
    ...props
}: FinalFormCurrencyInputProps): React.ReactElement {
    const intl = useIntl();
    const [formattedCurrencyValue, setFormattedCurrencyValue] = React.useState<string | undefined>(getFormattedValue(input.value));

    function getFormattedValue(value: number) {
        const formattedValueWithoutCurrencySign =
            value !== 0
                ? intl.formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : intl.formatNumber(0, { minimumFractionDigits: 2 });
        if (currencySignPosition === "before") {
            return `${currencySign} ${formattedValueWithoutCurrencySign}`;
        }
        return `${formattedValueWithoutCurrencySign} ${currencySign}`;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (value === "") {
            input.onChange(undefined);
            setFormattedCurrencyValue(undefined);
        } else {
            const numericValue = parseFloat(value.replace(/\D/g, "")) / 100;

            input.onChange(numericValue);
            setFormattedCurrencyValue(getFormattedValue(numericValue));
        }
    };

    return (
        <InputBase
            {...input}
            {...props}
            value={formattedCurrencyValue}
            onChange={handleChange}
            // onBlur={handleBlur}
            endAdornment={
                <>
                    {clearable && (
                        <ClearInputAdornment
                            position="end"
                            hasClearableContent={input.value !== undefined && true}
                            onClick={() => input.onChange(undefined)}
                        />
                    )}
                    {endAdornment}
                </>
            }
        />
    );
}
