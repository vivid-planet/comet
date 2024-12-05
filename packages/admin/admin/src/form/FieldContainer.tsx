import { FormControl, FormHelperText, FormLabel, formLabelClasses, inputBaseClasses, useThemeProps } from "@mui/material";
import { ComponentsOverrides, css } from "@mui/material/styles";
import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type FieldContainerProps = ThemedComponentBaseProps<{
    root: typeof FormControl;
    innerContainer: "div";
    label: typeof FormLabel;
    inputContainer: "div";
    error: typeof FormHelperText;
    warning: typeof FormHelperText;
    helperText: typeof FormHelperText;
}> & {
    variant?: "vertical" | "horizontal";
    forceVerticalContainerSize?: number;
    fullWidth?: boolean;
    label?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    warning?: string;
    scrollTo?: boolean;
    fieldMargin?: "always" | "never" | "onlyIfNotLast";
    helperText?: ReactNode;
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
    | "helperText";

type OwnerState = Pick<FieldContainerProps, "fullWidth" | "disabled" | "required" | "fieldMargin" | "variant"> & {
    hasError: boolean;
    hasWarning: boolean;
    hasLabel: boolean;
    forceVerticalContainerSize: number;
};

const Root = createComponentSlot(FormControl)<FieldContainerClassKey, OwnerState>({
    componentName: "FormFieldContainer",
    slotName: "root",
    classesResolver(ownerState) {
        return [
            ownerState.variant === "vertical" && "vertical",
            ownerState.variant === "horizontal" && "horizontal",
            ownerState.fullWidth && "fullWidth",
            ownerState.hasError && "hasError",
            ownerState.hasWarning && "hasWarning",
            ownerState.disabled && "disabled",
            ownerState.required && "required",
            ownerState.fieldMargin === "always" && "fieldMarginAlways",
            ownerState.fieldMargin === "never" && "fieldMarginNever",
            ownerState.fieldMargin === "onlyIfNotLast" && "fieldMarginOnlyIfNotLast",
        ];
    },
})(
    ({ theme, ownerState }) => css`
        max-width: 100%;

        ${ownerState.fullWidth &&
        css`
            container-type: inline-size;
            container-name: comet-admin-field-container-root;
        `}

        ${ownerState.fieldMargin !== "never" &&
        css`
            margin-bottom: ${theme.spacing(4)};
            ${!ownerState.fullWidth &&
            css`
                margin-right: ${theme.spacing(4)};
            `}
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
    `,
);

const InnerContainer = createComponentSlot("div")<FieldContainerClassKey, OwnerState>({
    componentName: "FormFieldContainer",
    slotName: "innerContainer",
})(
    ({ theme, ownerState }) => css`
        ${ownerState.variant === "horizontal" &&
        css`
            @container comet-admin-field-container-root (min-width: ${ownerState.forceVerticalContainerSize}px) {
                display: flex;
                flex-direction: row;
                max-width: 944px;
                gap: ${theme.spacing(4)};
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

const Label = createComponentSlot(FormLabel)<FieldContainerClassKey, OwnerState>({
    componentName: "FormFieldContainer",
    slotName: "label",
})(
    ({ theme, ownerState }) => css`
        ${!ownerState.hasLabel &&
        css`
            display: none;

            ${ownerState.variant === "horizontal" &&
            css`
                @container comet-admin-field-container-root (min-width: ${ownerState.forceVerticalContainerSize}px) {
                    display: block;
                }
            `}
        `}

        ${ownerState.variant === "horizontal" &&
        css`
            @container comet-admin-field-container-root (min-width: ${ownerState.forceVerticalContainerSize}px) {
                width: calc(100% / 3);
                flex-shrink: 0;
                flex-grow: 0;
                margin-bottom: 0;
                margin-top: ${theme.spacing(2)};
            }
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

const InputContainer = createComponentSlot("div")<FieldContainerClassKey, OwnerState>({
    componentName: "FormFieldContainer",
    slotName: "inputContainer",
})(
    ({ ownerState }) => css`
        ${ownerState.variant === "horizontal" &&
        ownerState.fullWidth &&
        css`
            @container comet-admin-field-container-root (min-width: ${ownerState.forceVerticalContainerSize}px) {
                flex-grow: 1;
            }
        `}

        ${ownerState.variant === "horizontal" &&
        css`
            @container comet-admin-field-container-root (min-width: ${ownerState.forceVerticalContainerSize}px) {
                min-height: 40px;

                > .CometAdminFormFieldContainer-root {
                    margin-bottom: 0;
                }
            }
        `}

        & > [class*="${inputBaseClasses.root}"] {
            width: 100%;
        }
    `,
);

const Error = createComponentSlot(FormHelperText)<FieldContainerClassKey>({
    componentName: "FormFieldContainer",
    slotName: "error",
})();

const Warning = createComponentSlot(FormHelperText)<FieldContainerClassKey>({
    componentName: "FormFieldContainer",
    slotName: "warning",
})(
    ({ theme }) => css`
        color: ${theme.palette.warning.main};
    `,
);

const HelperText = createComponentSlot(FormHelperText)<FieldContainerClassKey>({
    componentName: "FormFieldContainer",
    slotName: "helperText",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[300]};
    `,
);

export const FieldContainer = (inProps: PropsWithChildren<FieldContainerProps>) => {
    const {
        variant = "vertical",
        forceVerticalContainerSize = 600,
        fullWidth: passedFullWidth,
        label,
        error,
        disabled,
        required,
        children,
        warning,
        helperText,
        scrollTo = false,
        fieldMargin = "onlyIfNotLast",
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminFormFieldContainer" });
    const fullWidth = passedFullWidth ?? variant === "horizontal";

    const hasError = !!error;
    const hasWarning = !hasError && !!warning;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
        hasLabel: Boolean(label),
        forceVerticalContainerSize,
    };

    return (
        <Root ownerState={ownerState} fullWidth={fullWidth} disabled={disabled} required={required} ref={ref} {...slotProps?.root} {...restProps}>
            <InnerContainer ownerState={ownerState} {...slotProps?.innerContainer}>
                <Label ownerState={ownerState} disabled={disabled} {...slotProps?.label}>
                    {label}
                </Label>
                <InputContainer ownerState={ownerState} {...slotProps?.inputContainer}>
                    {children}
                    {hasError && (
                        <Error error {...slotProps?.error}>
                            {error}
                        </Error>
                    )}
                    {hasWarning && !hasError && <Warning {...slotProps?.warning}>{warning}</Warning>}
                    {helperText && !hasError && !hasWarning && <HelperText {...slotProps?.helperText}>{helperText}</HelperText>}
                </InputContainer>
            </InnerContainer>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFormFieldContainer: FieldContainerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFormFieldContainer: FieldContainerProps;
    }

    interface Components {
        CometAdminFormFieldContainer?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFormFieldContainer"]>;
            styleOverrides?: ComponentsOverrides["CometAdminFormFieldContainer"];
        };
    }
}
