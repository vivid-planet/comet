import { InputBase, type InputBaseProps } from "@mui/material";
import { Controller, type FieldPathByValue, type FieldValues, type UseControllerProps } from "react-hook-form";
import { useIntl } from "react-intl";

import { ClearInputAdornment } from "../../../common/ClearInputAdornment";
import { FieldContainer, type FieldContainerProps } from "../../FieldContainer";

type RHFTextFieldProps<TFieldValues extends FieldValues, TName extends FieldPathByValue<TFieldValues, string | null>, TTransformedValues> = Pick<
    UseControllerProps<TFieldValues, TName, TTransformedValues>,
    "name" | "rules" | "shouldUnregister" | "defaultValue" | "control" | "disabled" | "exact"
> &
    Pick<FieldContainerProps, "label" | "variant" | "fullWidth" | "helperText" | "required"> &
    InputBaseProps;

/**
 * @experimental
 */
export function RHFTextField<TFieldValues extends FieldValues, TName extends FieldPathByValue<TFieldValues, string | null>, TTransformedValues>({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled,
    exact,
    label,
    variant,
    fullWidth,
    helperText,
    required,
    endAdornment,
    ...restProps
}: RHFTextFieldProps<TFieldValues, TName, TTransformedValues>) {
    const intl = useIntl();
    const clearable = !required && !disabled;
    return (
        <Controller
            name={name}
            rules={required ? { required: true, ...rules } : rules}
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
                    <FieldContainer label={label} variant={variant} fullWidth={fullWidth} helperText={helperText} required={required} error={error}>
                        <InputBase
                            {...restProps}
                            name={field.name}
                            value={field.value ?? ""}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (value === "") {
                                    field.onChange(null);
                                } else {
                                    field.onChange(value);
                                }
                            }}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            disabled={field.disabled}
                            endAdornment={
                                (endAdornment || clearable) && (
                                    <>
                                        {clearable && field.value && <ClearInputAdornment position="end" onClick={() => field.onChange(null)} />}
                                        {endAdornment}
                                    </>
                                )
                            }
                        />
                    </FieldContainer>
                );
            }}
        />
    );
}
