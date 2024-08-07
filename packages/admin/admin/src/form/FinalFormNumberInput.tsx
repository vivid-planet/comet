import { InputBase, InputBaseProps } from "@mui/material";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";

export type FinalFormNumberInputProps = InputBaseProps &
    FieldRenderProps<number> & {
        clearable?: boolean;
        decimals?: number;
    };

export function FinalFormNumberInput({
    meta,
    input,
    innerRef,
    clearable,
    endAdornment,
    decimals = 0,
    ...props
}: FinalFormNumberInputProps): React.ReactElement {
    const intl = useIntl();

    const [formattedNumberValue, setFormattedNumberValue] = React.useState("");

    const getFormattedValue = React.useCallback(
        (value: number | undefined) => {
            const formattedValue =
                value !== undefined ? intl.formatNumber(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : "";
            return formattedValue;
        },
        [decimals, intl],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormattedNumberValue(value);
    };

    const updateFormattedNumberValue = React.useCallback(
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

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
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

    React.useEffect(() => {
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
