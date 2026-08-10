import { Error } from "@comet/admin-icons";
import { InputAdornment, inputBaseClasses, LinearProgress, MenuItem, Select, selectClasses, type SelectProps, Typography } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import { type ReactNode, useCallback, useRef, useState } from "react";
import type { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { ClearInputAdornment } from "../common/ClearInputAdornment";
import type { AsyncOptionsProps } from "../hooks/useAsyncOptionsProps";
import { LinearLoadingContainer, MenuItemDisabledOverrideOpacity } from "./FinalFormSelect.sc";

// The rendered adornments (clear button, error icon) change at runtime, so the space the select's text must leave
// for them cannot be a fixed value (the theme's default only fits the clear button). The adornment is absolutely
// positioned by the theme; the measured distance between its left edge and the right edge of the input is reserved
// as padding, so the text can never render underneath the adornment.
const AdornedSelect = styled(Select, {
    shouldForwardProp: (prop) => prop !== "endAdornmentWidth",
})<{ endAdornmentWidth?: number }>(
    ({ endAdornmentWidth }) => css`
        ${endAdornmentWidth !== undefined &&
        endAdornmentWidth > 0 &&
        css`
            /* Overrides the fixed "inputAdornedEnd" padding-right from the MuiSelect theme. */
            & .${selectClasses.select}.${inputBaseClasses.inputAdornedEnd} {
                padding-right: ${endAdornmentWidth}px;
            }
        `}
    `,
);

const EndAdornmentContainer = styled(InputAdornment)(
    ({ theme }) => css`
        padding-left: ${theme.spacing(2)};
    `,
);

export interface FinalFormSelectProps<T> {
    noOptionsText?: ReactNode;
    errorText?: ReactNode;
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string;
    children?: ReactNode;
    required?: boolean;
    loadingError?: Error | null;
}

type FinalFormSelectInternalProps<T> = FieldRenderProps<T, HTMLInputElement | HTMLTextAreaElement>;

/**
 * Final Form-compatible Select component.
 *
 * @see {@link SelectField} – preferred for typical form use. Use this only if no Field wrapper is needed.
 */
export const FinalFormSelect = <T,>({
    input: { checked, value: incomingValue, name, onChange, onFocus, onBlur, ...restInput },
    meta,
    isAsync = false,
    options = [],
    loading = false,
    loadingError,
    getOptionLabel = (option: T) => {
        if (typeof option === "object") {
            console.error(`The \`getOptionLabel\` method of FinalFormSelect returned an object instead of a string for${JSON.stringify(option)}.`);
        }
        return "";
    },
    getOptionValue = (option: T) => {
        if (typeof option === "object" && option !== null) {
            if ((option as any).id) {
                return String((option as any).id);
            }
            if ((option as any).value) {
                return String((option as any).value);
            }
            return JSON.stringify(option);
        } else {
            return String(option);
        }
    },

    noOptionsText = (
        <Typography variant="body2">
            <FormattedMessage id="finalFormSelect.noOptions" defaultMessage="No options." />
        </Typography>
    ),
    errorText = (
        <Typography variant="body2">
            <FormattedMessage id="finalFormSelect.error" defaultMessage="Error loading options." />
        </Typography>
    ),
    disabled,
    children,
    required,
    ...rest
}: FinalFormSelectProps<T> & FinalFormSelectInternalProps<T> & Partial<AsyncOptionsProps<T>> & Omit<SelectProps, "input" | "endAdornment">) => {
    // Depending on the usage, `multiple` is either a root prop or in the `input` prop.
    // 1. <Field component={FinalFormSelect} multiple /> -> multiple is in restInput
    // 2. <Field>{(props) => <FinalFormSelect {...props} multiple />}</Field> -> multiple is in rest
    const multiple = restInput.multiple ?? rest.multiple;

    const value = multiple ? (Array.isArray(incomingValue) ? incomingValue : []) : incomingValue;

    const hasClearableContent = !disabled && (multiple && Array.isArray(value) ? value.length > 0 : value !== undefined && value !== "");

    const clearAdornment =
        !required && hasClearableContent ? <ClearInputAdornment position="end" onClick={() => onChange(multiple ? [] : undefined)} /> : null;

    const [endAdornmentWidth, setEndAdornmentWidth] = useState<number>();
    const endAdornmentResizeObserver = useRef<ResizeObserver | undefined>(undefined);
    const endAdornmentRef = useCallback((node: HTMLDivElement | null) => {
        endAdornmentResizeObserver.current?.disconnect();
        endAdornmentResizeObserver.current = undefined;

        if (node) {
            const measureReservedSpace = () => {
                const inputRoot = node.closest(`.${inputBaseClasses.root}`);
                if (inputRoot) {
                    setEndAdornmentWidth(Math.ceil(inputRoot.getBoundingClientRect().right - node.getBoundingClientRect().left));
                }
            };
            measureReservedSpace();
            endAdornmentResizeObserver.current = new ResizeObserver(measureReservedSpace);
            endAdornmentResizeObserver.current.observe(node);
        } else {
            setEndAdornmentWidth(undefined);
        }
    }, []);

    const selectProps = {
        ...rest,
        multiple,
        disabled,
        name,
        onChange,
        onFocus,
        onBlur,
        required,
    };

    if (children) {
        return (
            <AdornedSelect
                {...selectProps}
                endAdornment={
                    clearAdornment && (
                        <EndAdornmentContainer position="end" ref={endAdornmentRef}>
                            {clearAdornment}
                        </EndAdornmentContainer>
                    )
                }
                endAdornmentWidth={endAdornmentWidth}
                value={value}
            >
                {children}
            </AdornedSelect>
        );
    }

    const showLoadingMessage = loading === true && options.length === 0 && loadingError == null;
    const showLinearProgress = loading === true && !showLoadingMessage;
    const showOptions = options.length > 0 && loadingError == null;
    const showError = loadingError != null && !loading;
    const showNoOptions = loading === false && loadingError == null && options.length === 0;

    return (
        <AdornedSelect
            {...selectProps}
            endAdornmentWidth={endAdornmentWidth}
            endAdornment={
                (loadingError || clearAdornment) && (
                    <EndAdornmentContainer position="end" ref={endAdornmentRef}>
                        {loadingError && <Error color="error" />}

                        {clearAdornment}
                    </EndAdornmentContainer>
                )
            }
            onChange={(event) => {
                const value = event.target.value;
                onChange(
                    Array.isArray(value)
                        ? value.map((v) => options.find((i) => getOptionValue(i) == v))
                        : options.find((i) => getOptionValue(i) == value),
                );
            }}
            value={Array.isArray(value) ? value.map((i) => getOptionValue(i)) : getOptionValue(value)}
            renderValue={() => {
                if (Array.isArray(value)) {
                    return value.map((i) => getOptionLabel(i)).join(", ");
                } else {
                    return getOptionLabel(value);
                }
            }}
        >
            <LinearLoadingContainer>{showLinearProgress && <LinearProgress />}</LinearLoadingContainer>
            {showLoadingMessage && (
                <MenuItemDisabledOverrideOpacity value="" disabled>
                    <FormattedMessage id="common.loading" defaultMessage="Loading ..." />
                </MenuItemDisabledOverrideOpacity>
            )}

            {options.length === 0 &&
                value &&
                (Array.isArray(value) ? (
                    value.map((v) => (
                        <MenuItem value={getOptionValue(v)} key={getOptionValue(v)} sx={{ display: "none" }}>
                            {getOptionLabel(v)}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem value={getOptionValue(value)} key={getOptionValue(value)} sx={{ display: "none" }}>
                        {getOptionLabel(value)}
                    </MenuItem>
                ))}

            {showNoOptions && (
                <MenuItemDisabledOverrideOpacity value="" disabled>
                    {noOptionsText}
                </MenuItemDisabledOverrideOpacity>
            )}
            {showError && (
                <MenuItemDisabledOverrideOpacity value="" disabled>
                    {errorText}
                </MenuItemDisabledOverrideOpacity>
            )}

            {showOptions &&
                options.map((option: T) => (
                    <MenuItem value={getOptionValue(option)} key={getOptionValue(option)}>
                        {getOptionLabel(option)}
                    </MenuItem>
                ))}
        </AdornedSelect>
    );
};
