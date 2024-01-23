import { FormControl, FormHelperText, FormLabel, formLabelClasses, inputBaseClasses, useThemeProps } from "@mui/material";
import { ComponentsOverrides, css, styled } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type FieldContainerProps = ThemedComponentBaseProps<{
    root: typeof FormControl;
    label: typeof FormLabel;
    inputContainer: "div";
    error: typeof FormHelperText;
    warning: typeof FormHelperText;
}> & {
    variant?: "vertical" | "horizontal";
    fullWidth?: boolean;
    requiredSymbol?: React.ReactNode;
    label?: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    warning?: string;
    scrollTo?: boolean;
    fieldMargin?: "always" | "never" | "onlyIfNotLast";
};

export type FieldContainerClassKey =
    | "root"
    | "vertical"
    | "horizontal"
    | "fullWidth"
    | "required"
    | "disabled"
    | "fieldMarginAlways"
    | "fieldMarginNever"
    | "fieldMarginOnlyIfNotLast"
    | "label"
    | "inputContainer"
    | "hasError"
    | "error"
    | "hasWarning"
    | "warning";

type OwnerState = Pick<FieldContainerProps, "fullWidth" | "disabled" | "required" | "fieldMargin" | "variant"> & {
    hasError: boolean;
    hasWarning: boolean;
};

export const Root = styled(FormControl, {
    name: "CometAdminFormFieldContainer",
    slot: "root",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [
            styles.root,
            ownerState.variant === "vertical" && styles.vertical,
            ownerState.variant === "horizontal" && styles.horizontal,
            ownerState.fullWidth && styles.fullWidth,
            ownerState.hasError && styles.hasError,
            ownerState.hasWarning && styles.hasWarning,
            ownerState.disabled && styles.disabled,
            ownerState.required && styles.required,
            ownerState.fieldMargin === "always" && styles.fieldMarginAlways,
            ownerState.fieldMargin === "never" && styles.fieldMarginNever,
            ownerState.fieldMargin === "onlyIfNotLast" && styles.fieldMarginOnlyIfNotLast,
        ];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        ${ownerState.fieldMargin !== "never" &&
        css`
            margin-bottom: ${theme.spacing(4)};
            ${!ownerState.fullWidth &&
            css`
                margin-right: ${theme.spacing(4)};
            `}
        `}

        & [class*="${inputBaseClasses.root}"] {
            width: 100%;
        }

        ${ownerState.variant === "horizontal" &&
        css`
            display: flex;
            flex-direction: row;
            align-items: center;
        `}

        ${ownerState.fieldMargin === "onlyIfNotLast" &&
        css`
            &:last-child {
                margin-bottom: 0;

                ${!ownerState.fullWidth &&
                css`
                    margin-right: 0;
                `}
            }
        `}

        ${ownerState.hasError &&
        css`
            [class*="${inputBaseClasses.root}"]:not([class*="${inputBaseClasses.focused}"]) {
                border-color: ${theme.palette.error.main};
            }
        `}

        ${ownerState.hasWarning &&
        css`
            [class*="${inputBaseClasses.root}"]:not([class*="${inputBaseClasses.focused}"]) {
                border-color: ${theme.palette.warning.main};
            }
        `}
    `,
);

const Label = styled(FormLabel, {
    name: "CometAdminFormFieldContainer",
    slot: "label",
    overridesResolver(_, styles) {
        return [styles.label];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        ${ownerState.variant === "horizontal" &&
        css`
            width: 220px;
            flex-shrink: 0;
            flex-grow: 0;
            margin-bottom: 0;
        `}

        ${ownerState.disabled &&
        css`
            color: ${theme.palette.text.disabled};
        `}

        ${ownerState.hasError &&
        css`
            &:not([class*="${formLabelClasses.focused}"]) {
                color: ${theme.palette.error.main};
            }
        `}

        ${ownerState.hasWarning &&
        css`
            &:not([class*="${formLabelClasses.focused}"]) {
                color: ${theme.palette.warning.main};
            }
        `}
    `,
);

const InputContainer = styled("div", {
    name: "CometAdminFormFieldContainer",
    slot: "inputContainer",
    overridesResolver(_, styles) {
        return [styles.inputContainer];
    },
})<{ ownerState: OwnerState }>(
    ({ ownerState }) => css`
        ${ownerState.variant === "horizontal" &&
        ownerState.fullWidth &&
        css`
            flex-grow: 1;
        `}
    `,
);

const Error = styled(FormHelperText, {
    name: "CometAdminFormFieldContainer",
    slot: "error",
    overridesResolver(_, styles) {
        return [styles.error];
    },
})();

const Warning = styled(FormHelperText, {
    name: "CometAdminFormFieldContainer",
    slot: "warning",
    overridesResolver(_, styles) {
        return [styles.warning];
    },
})(
    ({ theme }) => css`
        color: ${theme.palette.warning.main};
    `,
);

export const FieldContainer = (inProps: React.PropsWithChildren<FieldContainerProps>) => {
    const {
        variant = "vertical",
        fullWidth,
        label,
        error,
        disabled,
        required,
        requiredSymbol = "*",
        children,
        warning,
        scrollTo = false,
        fieldMargin = "onlyIfNotLast",
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminFormFieldContainer" });

    const hasError = !!error;
    const hasWarning = !hasError && !!warning;

    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollTo) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollTo]);

    const ownerState: OwnerState = {
        fullWidth,
        disabled,
        required,
        fieldMargin,
        variant,
        hasError,
        hasWarning,
    };

    return (
        <Root ownerState={ownerState} fullWidth={fullWidth} disabled={disabled} required={required} ref={ref} {...restProps} {...slotProps?.root}>
            <>
                {label && (
                    <Label ownerState={ownerState} disabled={disabled} {...slotProps?.label}>
                        {label}
                        {required && requiredSymbol}
                    </Label>
                )}
                <InputContainer ownerState={ownerState} {...slotProps?.inputContainer}>
                    {children}
                    {hasError && (
                        <Error error {...slotProps?.error}>
                            {error}
                        </Error>
                    )}
                    {hasWarning && !hasError && <Warning {...slotProps?.warning}>{warning}</Warning>}
                </InputContainer>
            </>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFormFieldContainer: FieldContainerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFormFieldContainer: Partial<FieldContainerProps>;
    }

    interface Components {
        CometAdminFormFieldContainer?: {
            defaultProps?: ComponentsPropsList["CometAdminFormFieldContainer"];
            styleOverrides?: ComponentsOverrides["CometAdminFormFieldContainer"];
        };
    }
}
