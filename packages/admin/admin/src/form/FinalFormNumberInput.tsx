import { InputBase, InputBaseProps } from "@mui/material";
import { ChangeEvent, FocusEvent, useCallback, useEffect, useState } from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";

export type FinalFormNumberInputProps = InputBaseProps &
    FieldRenderProps<number> & {
        clearable?: boolean;
        decimals?: number;
    };

export function FinalFormNumberInput({ meta, input, innerRef, clearable, endAdornment, decimals = 0, ...props }: FinalFormNumberInputProps) {
    const intl = useIntl();

    const [formattedNumberValue, setFormattedNumberValue] = useState("");

    const getFormattedValue = useCallback(
        (value: number | undefined) => {
            const formattedValue =
                value !== undefined ? intl.formatNumber(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : "";
            return formattedValue;
        },
        [decimals, intl],
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormattedNumberValue(value);
    };

    const updateFormattedNumberValue = useCallback(
        (inputValue?: number) => {
            if (!inputValue && inputValue !== 0) {
                input.onChange(undefined);
                setFormattedNumberValue("");
            } else {
                setFormattedNumberValue(getFormattedValue(inputValue));
            }
        },
        [getFormattedValue, input],
    );

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        input.onBlur(event);
        const { value } = event.target;
        const numberParts = intl.formatNumberToParts(1111.111);
        const decimalSymbol = numberParts.find(({ type }) => type === "decimal")?.value;
        const thousandSeparatorSymbol = numberParts.find(({ type }) => type === "group")?.value;

        const numericValue = parseFloat(
            value
                .split(thousandSeparatorSymbol || "")
                .join("")
                .split(decimalSymbol || ".")
                .join("."),
        );

        const roundToDecimals = (numericValue: number, decimals: number) => {
            const factor = Math.pow(10, decimals);
            return Math.round(numericValue * factor) / factor;
        };

        const inputValue: number | undefined = isNaN(numericValue) ? undefined : roundToDecimals(numericValue, decimals);
        input.onChange(inputValue);

        if (input.value === inputValue) {
            updateFormattedNumberValue(inputValue);
        }
    };

    useEffect(() => {
        updateFormattedNumberValue(input.value);
    }, [updateFormattedNumberValue, input]);

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
                            hasClearableContent={typeof input.value === "number"}
                            onClick={() => input.onChange(undefined)}
                        />
                    )}
                </>
            }
        />
    );
}
