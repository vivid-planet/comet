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

    const numberParts = intl.formatNumberToParts(1111.111);
    const decimalSymbol = numberParts.find(({ type }) => type === "decimal")?.value;
    const thousandSeparatorSymbol = numberParts.find(({ type }) => type === "group")?.value;

    const [formattedCurrencyValue, setFormattedCurrencyValue] = React.useState<string | undefined>("");

    const getFormattedValue = React.useCallback(
        (value: number) => {
            const formattedValue =
                value !== 0
                    ? intl.formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : intl.formatNumber(0, { minimumFractionDigits: 2 });
            return formattedValue;
        },
        [intl],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormattedCurrencyValue(value);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { value } = event.target;
        let numericValue: number;

        if (decimalSymbol === ",") {
            numericValue = parseFloat(value.split(`${thousandSeparatorSymbol}`).join("").split(`${decimalSymbol}`).join("."));
        } else {
            numericValue = parseFloat(value.split(`${thousandSeparatorSymbol}`).join(""));
        }
        input.onChange(numericValue);
        isNaN(numericValue) ? setFormattedCurrencyValue(getFormattedValue(0)) : setFormattedCurrencyValue(getFormattedValue(numericValue));
    };

    React.useEffect(() => {
        setFormattedCurrencyValue(getFormattedValue(input.value));
    }, [getFormattedValue, input.value]);

    return (
        <InputBase
            {...input}
            {...props}
            value={formattedCurrencyValue}
            onChange={handleChange}
            onBlur={handleBlur}
            endAdornment={
                <>
                    {endAdornment}
                    {clearable && (
                        <ClearInputAdornment
                            position="end"
                            hasClearableContent={input.value !== undefined && true}
                            onClick={() => input.onChange(undefined)}
                        />
                    )}
                </>
            }
        />
    );
}
