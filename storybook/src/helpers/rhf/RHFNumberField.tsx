import { ClearInputAdornment, FieldContainer, type FieldContainerProps } from "@comet/admin";
import { InputBase, type InputBaseProps } from "@mui/material";
import { type ChangeEvent, type FocusEvent, useCallback, useEffect, useState } from "react";
import {
    Controller,
    type ControllerRenderProps,
    type FieldPath,
    type FieldPathByValue,
    type FieldValues,
    type UseControllerProps,
} from "react-hook-form";
import { useIntl } from "react-intl";

// A number with integer and decimal parts used to extract locale-specific formatting symbols
const LOCALE_FORMAT_SAMPLE_NUMBER = 1111.111;

function roundToDecimals(numericValue: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(numericValue * factor) / factor;
}

function RHFNumberFieldInner<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    clearable,
    endAdornment,
    decimals = 0,
    field,
    ...restProps
}: {
    clearable?: boolean;
    decimals?: number;
    field: ControllerRenderProps<TFieldValues, TName>;
} & InputBaseProps) {
    const intl = useIntl();

    const [formattedNumberValue, setFormattedNumberValue] = useState("");

    const getFormattedValue = useCallback(
        (value: number | null) => {
            return value !== null ? intl.formatNumber(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : "";
        },
        [decimals, intl],
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormattedNumberValue(value);
    };

    const updateFormattedNumberValue = useCallback(
        (inputValue: number | null) => {
            if (!inputValue && inputValue !== 0) {
                setFormattedNumberValue("");
            } else {
                setFormattedNumberValue(getFormattedValue(inputValue));
            }
        },
        [getFormattedValue],
    );

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        field.onBlur();
        const { value } = event.target;
        const numberParts = intl.formatNumberToParts(LOCALE_FORMAT_SAMPLE_NUMBER);
        const decimalSymbol = numberParts.find(({ type }) => type === "decimal")?.value;
        const thousandSeparatorSymbol = numberParts.find(({ type }) => type === "group")?.value;

        const numericValue = parseFloat(
            value
                .split(thousandSeparatorSymbol ?? "")
                .join("")
                .split(decimalSymbol ?? ".")
                .join("."),
        );

        const inputValue: number | null = isNaN(numericValue) ? null : roundToDecimals(numericValue, decimals);
        field.onChange(inputValue);

        if (field.value === inputValue) {
            updateFormattedNumberValue(inputValue);
        }
    };

    useEffect(() => {
        updateFormattedNumberValue(field.value);
    }, [updateFormattedNumberValue, field.value]);

    return (
        <InputBase
            {...restProps}
            value={formattedNumberValue}
            onChange={handleChange}
            onBlur={handleBlur}
            name={field.name}
            inputRef={field.ref}
            disabled={field.disabled}
            endAdornment={
                (endAdornment || clearable) && (
                    <>
                        {clearable && (
                            <ClearInputAdornment
                                position="end"
                                hasClearableContent={typeof field.value === "number"}
                                onClick={() => field.onChange(null)}
                            />
                        )}
                        {endAdornment}
                    </>
                )
            }
        />
    );
}

type RHFNumberFieldProps<
    TFieldValues extends FieldValues,
    TName extends FieldPathByValue<TFieldValues, number | null>,
    TTransformedValues,
> = UseControllerProps<TFieldValues, TName, TTransformedValues> &
    Pick<FieldContainerProps, "label" | "variant" | "fullWidth" | "helperText"> & { clearable?: boolean; decimals?: number } & InputBaseProps;

export function RHFNumberField<TFieldValues extends FieldValues, TName extends FieldPathByValue<TFieldValues, number | null>, TTransformedValues>({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled,
    exact,
    clearable,
    decimals,
    label,
    variant,
    fullWidth,
    helperText,
    ...restProps
}: RHFNumberFieldProps<TFieldValues, TName, TTransformedValues>) {
    const intl = useIntl();

    return (
        <Controller
            name={name}
            rules={rules}
            shouldUnregister={shouldUnregister}
            defaultValue={defaultValue}
            control={control}
            disabled={disabled}
            exact={exact}
            render={({ field, fieldState }) => {
                let error = undefined;
                if (fieldState.error) {
                    if (fieldState.error.message) {
                        error = fieldState.error.message;
                    } else if (fieldState.error.type === "required") {
                        error = intl.formatMessage({ id: "form.validation.required", defaultMessage: "Required" });
                    } else {
                        error = fieldState.error.type;
                    }
                }
                return (
                    <FieldContainer label={label} variant={variant} fullWidth={fullWidth} helperText={helperText} error={error}>
                        <RHFNumberFieldInner {...restProps} field={field} clearable={clearable} decimals={decimals} />
                    </FieldContainer>
                );
            }}
        />
    );
}
