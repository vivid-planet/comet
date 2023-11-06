import { FormControl, FormHelperText, FormLabel, inputBaseClasses, useThemeProps } from "@mui/material";
import { ComponentsOverrides, css, styled } from "@mui/material/styles";
import * as React from "react";

export type FieldContainerProps = {
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

type RootProps = Pick<FieldContainerProps, "fullWidth" | "disabled" | "required" | "fieldMargin"> & {
    hasError: boolean;
    hasWarning: boolean;
    fieldVariant?: FieldContainerProps["variant"]; // Must not be named `variant`, because `FormControl` already has that prop.
};

const Root = styled(FormControl, {
    name: "CometAdminFormFieldContainer",
    slot: "Root",
    overridesResolver({ fieldVariant, fullWidth, hasError, hasWarning, disabled, required, fieldMargin }: RootProps, styles) {
        return [
            styles.root,
            fieldVariant === "vertical" && styles.vertical,
            fieldVariant === "horizontal" && styles.horizontal,
            fullWidth && styles.fullWidth,
            hasError && styles.hasError,
            hasWarning && styles.hasWarning,
            disabled && styles.disabled,
            required && styles.required,
            fieldMargin === "always" && styles.fieldMarginAlways,
            fieldMargin === "never" && styles.fieldMarginNever,
            fieldMargin === "onlyIfNotLast" && styles.fieldMarginOnlyIfNotLast,
        ];
    },
})<RootProps>(
    ({ fieldVariant, fullWidth, fieldMargin, theme }) => css`
        ${fieldMargin !== "never" &&
        css`
            margin-bottom: ${theme.spacing(4)};
            ${!fullWidth &&
            css`
                margin-right: ${theme.spacing(4)};
            `}
        `}

        & [class*="${inputBaseClasses.root}"] {
            width: 100%;
        }

        ${fieldVariant === "horizontal" &&
        css`
            display: flex;
            flex-direction: row;
            align-items: center;
        `}

        ${fieldMargin === "onlyIfNotLast" &&
        css`
            &:last-child {
                margin-bottom: 0;

                ${!fullWidth &&
                css`
                    margin-right: 0;
                `}
            }
        `}
    `,
);

type LabelProps = Pick<FieldContainerProps, "variant" | "disabled"> & {
    hasError: boolean;
    hasWarning: boolean;
};

const Label = styled(FormLabel, {
    name: "CometAdminFormFieldContainer",
    slot: "Label",
    overridesResolver(_: LabelProps, styles) {
        return [styles.label];
    },
})<LabelProps>(
    ({ variant, disabled, hasError, hasWarning, theme }) => css`
        ${variant === "horizontal" &&
        css`
            width: 220px;
            flex-shrink: 0;
            flex-grow: 0;
            margin-bottom: 0;
        `}

        ${disabled &&
        css`
            color: ${theme.palette.text.disabled};
        `}

        ${hasError &&
        css`
            &:not([class*="Mui-focused"]) {
                color: ${theme.palette.error.main};
            }
            [class*="MuiInputBase-root"]:not([class*="Mui-focused"]) {
                border-color: ${theme.palette.error.main};
            }
        `}

        ${hasWarning &&
        css`
            &:not([class*="Mui-focused"]) {
                color: ${theme.palette.warning.main};
            }
            [class*="MuiInputBase-root"]:not([class*="Mui-focused"]) {
                border-color: ${theme.palette.warning.main};
            }
        `}
    `,
);

type InputContainerProps = Pick<FieldContainerProps, "variant" | "fullWidth">;

const InputContainer = styled("div", {
    name: "CometAdminFormFieldContainer",
    slot: "InputContainer",
    overridesResolver(_: InputContainerProps, styles) {
        return [styles.inputContainer];
    },
})<InputContainerProps>(
    ({ variant, fullWidth }) => css`
        ${variant === "horizontal" &&
        fullWidth &&
        css`
            flex-grow: 1;
        `}
    `,
);

const Error = styled(FormHelperText, {
    name: "CometAdminFormFieldContainer",
    slot: "Error",
    overridesResolver(_, styles) {
        return [styles.error];
    },
})();

const Warning = styled(FormHelperText, {
    name: "CometAdminFormFieldContainer",
    slot: "Warning",
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
    } = useThemeProps({ props: inProps, name: "CometAdminFormFieldContainer" });

    const hasError = !!error;
    const hasWarning = !hasError && !!warning;

    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollTo) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollTo]);

    return (
        <Root
            fieldVariant={variant}
            fullWidth={fullWidth}
            disabled={disabled}
            required={required}
            fieldMargin={fieldMargin}
            hasError={hasError}
            hasWarning={hasWarning}
            ref={ref}
        >
            <>
                {label && (
                    <Label variant={variant} disabled={disabled} hasError={hasError} hasWarning={hasWarning}>
                        {label}
                        {required && requiredSymbol}
                    </Label>
                )}
                <InputContainer variant={variant} fullWidth={fullWidth}>
                    {children}
                    {hasError && <Error error>{error}</Error>}
                    {hasWarning && !hasError && <Warning>{warning}</Warning>}
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
