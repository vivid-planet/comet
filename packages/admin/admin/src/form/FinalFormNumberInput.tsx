import { InputBase, InputBaseProps } from "@mui/material";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";

export type FinalFormNumberInputProps = InputBaseProps &
    FieldRenderProps<number> & {
        clearable?: boolean;
    };

export function FinalFormNumberInput({ meta, input, innerRef, clearable, endAdornment, ...props }: FinalFormNumberInputProps): React.ReactElement {
    const intl = useIntl();

    const numberParts = intl.formatNumberToParts(1111.111);
    const decimalSymbol = numberParts.find(({ type }) => type === "decimal")?.value;
    const thousandSeparatorSymbol = numberParts.find(({ type }) => type === "group")?.value;

    const [formattedNumberValue, setFormattedNumberValue] = React.useState<string | undefined>("");

    const getFormattedValue = React.useCallback(
        (value: number | undefined) => {
            const formattedValue = value !== undefined ? intl.formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
            return formattedValue;
        },
        [intl],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormattedNumberValue(value);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { value } = event.target;
        let numericValue: number;

        if (decimalSymbol === ",") {
            numericValue = parseFloat(value.split(`${thousandSeparatorSymbol}`).join("").split(`${decimalSymbol}`).join("."));
        } else {
            numericValue = parseFloat(value.split(`${thousandSeparatorSymbol}`).join(""));
        }
        const inputValue = isNaN(numericValue) ? undefined : numericValue;
        input.onChange(inputValue);
        setFormattedNumberValue(getFormattedValue(inputValue));
    };

    React.useEffect(() => {
        setFormattedNumberValue(getFormattedValue(input.value));
    }, [getFormattedValue, input.value]);

    return (
        <InputBase
            {...input}
            {...props}
            value={formattedNumberValue}
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
