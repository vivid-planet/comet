import { FormField, type FormFieldSlotProps } from "@dextinity/ui";
import { css, styled } from "@mui/material/styles";
import { type CSSProperties, type PropsWithChildren, type ReactNode, useEffect, useRef } from "react";

export type FieldContainerProps = {
    variant?: "vertical" | "horizontal";
    /** @deprecated Has no effect: a horizontal field stacks its label and control below a width of about 600 pixels. */
    forceVerticalContainerSize?: number;
    fullWidth?: boolean;
    label?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    error?: ReactNode;
    warning?: ReactNode;
    scrollTo?: boolean;
    fieldMargin?: "always" | "never" | "onlyIfNotLast";
    helperText?: ReactNode;
    secondaryHelperText?: ReactNode;
    helperTextIcon?: ReactNode;
    className?: string;
    style?: CSSProperties;
    slotProps?: FormFieldSlotProps;
    "data-testid"?: string;
};

export type FieldContainerClassKey =
    | "root"
    | "innerContainer"
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
    | "warning"
    | "helperText"
    | "secondaryHelperText"
    | "helperTextsWrapper"
    | "helperTextContent";

type OwnerState = Required<Pick<FieldContainerProps, "fullWidth" | "fieldMargin">> & {
    hasError: boolean;
    hasWarning: boolean;
};

const legacyClassNamePrefix = "DextinityAdminFormFieldContainer";

/**
 * A form field's frame: the label, the control, the helper text and the error or warning, built on `FormField` of `@dextinity/ui`.
 * Other components select the legacy `DextinityAdminFormFieldContainer-*` classes, so the root keeps them.
 */
export const FieldContainer = ({
    variant = "vertical",
    forceVerticalContainerSize,
    fullWidth: passedFullWidth,
    label,
    error,
    disabled,
    required,
    children,
    warning,
    helperText,
    secondaryHelperText,
    helperTextIcon,
    scrollTo = false,
    fieldMargin = "onlyIfNotLast",
    className,
    slotProps,
    ...restProps
}: PropsWithChildren<FieldContainerProps>) => {
    const fullWidth = passedFullWidth ?? variant === "horizontal";
    const hasError = Boolean(error);
    const hasWarning = !hasError && Boolean(warning);
    const hasHelperText = Boolean(helperText) && !hasError && !hasWarning;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollTo) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollTo]);

    const ownerState: OwnerState = { fullWidth, fieldMargin, hasError, hasWarning };

    return (
        <Root
            ref={ref}
            ownerState={ownerState}
            orientation={variant}
            label={label}
            required={required}
            disabled={disabled}
            error={hasError ? <MessageWithIcon icon={helperTextIcon}>{error}</MessageWithIcon> : undefined}
            warning={hasWarning ? <MessageWithIcon icon={helperTextIcon}>{warning}</MessageWithIcon> : undefined}
            description={
                hasHelperText || Boolean(secondaryHelperText) ? (
                    <HelperTexts>
                        {hasHelperText && <MessageWithIcon icon={helperTextIcon}>{helperText}</MessageWithIcon>}
                        {Boolean(secondaryHelperText) && <SecondaryHelperText>{secondaryHelperText}</SecondaryHelperText>}
                    </HelperTexts>
                ) : undefined
            }
            className={[
                `${legacyClassNamePrefix}-root`,
                `${legacyClassNamePrefix}-${variant}`,
                fullWidth && `${legacyClassNamePrefix}-fullWidth`,
                required && `${legacyClassNamePrefix}-required`,
                disabled && `${legacyClassNamePrefix}-disabled`,
                hasError && `${legacyClassNamePrefix}-hasError`,
                hasWarning && `${legacyClassNamePrefix}-hasWarning`,
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            slotProps={slotProps}
            {...restProps}
        >
            {children}
        </Root>
    );
};

const MessageWithIcon = ({ icon, children }: PropsWithChildren<{ icon: ReactNode }>) => {
    if (!icon) {
        return children;
    }

    return (
        <MessageWithIconRoot>
            {icon}
            <span>{children}</span>
        </MessageWithIconRoot>
    );
};

const Root = styled(FormField, { shouldForwardProp: (prop) => prop !== "ownerState" })<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        max-width: 100%;

        ${
            !ownerState.fullWidth &&
            css`
                display: inline-flex;
                vertical-align: top;
            `
        }

        ${
            ownerState.fieldMargin !== "never" &&
            css`
                margin-bottom: ${theme.spacing(4)};

                ${
                    !ownerState.fullWidth &&
                    css`
                        margin-right: ${theme.spacing(4)};
                    `
                }
            `
        }

        ${
            (ownerState.hasError || ownerState.hasWarning) &&
            css`
                /* MUI inputs that are still in use, such as an autocomplete or a date picker, don't read the field's state. */
                [class*="MuiInputBase-root"]:not([class*="Mui-focused"]) {
                    border-color: ${ownerState.hasError ? theme.palette.error.main : theme.palette.warning.main};
                }

                .DextinityAdminRte-root:not(:focus-within) {
                    --dextinity-admin-rte-outer-border-color: ${ownerState.hasError ? theme.palette.error.main : theme.palette.warning.main};
                }
            `
        }

        ${
            ownerState.fieldMargin === "onlyIfNotLast" &&
            css`
                &:last-child {
                    margin-bottom: 0;

                    ${
                        !ownerState.fullWidth &&
                        css`
                            margin-right: 0;
                        `
                    }
                }
            `
        }
    `,
);

const HelperTexts = styled("span")`
    display: flex;
    gap: ${({ theme }) => theme.spacing(3)};
    justify-content: space-between;
`;

const SecondaryHelperText = styled("span")`
    margin-left: auto;
`;

const MessageWithIconRoot = styled("span")`
    display: inline-flex;
    gap: ${({ theme }) => theme.spacing(1)};
    align-items: flex-start;

    > svg {
        flex-shrink: 0;
        width: 12px;
        height: 1lh;
    }
`;

// Kept so that themes setting these keep compiling, although FieldContainer no longer reads the MUI theme.
declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        DextinityAdminFormFieldContainer: FieldContainerProps;
    }

    interface Components {
        DextinityAdminFormFieldContainer?: {
            /** @deprecated Has no effect: FieldContainer is built on `@dextinity/ui` and doesn't read the MUI theme. */
            defaultProps?: Partial<ComponentsPropsList["DextinityAdminFormFieldContainer"]>;
        };
    }
}
