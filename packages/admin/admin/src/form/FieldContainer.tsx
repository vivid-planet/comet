import { FormControl, FormHelperText, FormLabel, formLabelClasses, inputBaseClasses, useThemeProps } from "@mui/material";
import { ComponentsOverrides, css } from "@mui/material/styles";
import * as React from "react";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { useObservedWidth } from "../utils/useObservedWidth";

export type FieldContainerProps = ThemedComponentBaseProps<{
    root: typeof FormControl;
    label: typeof FormLabel;
    inputContainer: "div";
    error: typeof FormHelperText;
    warning: typeof FormHelperText;
    helperText: typeof FormHelperText;
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
    helperText?: React.ReactNode;
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
    | "warning"
    | "helperText";

type OwnerState = Pick<FieldContainerProps, "fullWidth" | "disabled" | "required" | "fieldMargin" | "variant"> & {
    hasError: boolean;
    hasWarning: boolean;
    forceVertical: boolean;
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
        !ownerState.forceVertical &&
        css`
            display: flex;
            flex-direction: row;
            align-items: center;
            max-width: 944px;
            gap: ${theme.spacing(4)};
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

const Label = createComponentSlot(FormLabel)<FieldContainerClassKey, OwnerState>({
    componentName: "FormFieldContainer",
    slotName: "label",
})(
    ({ theme, ownerState }) => css`
        ${ownerState.variant === "horizontal" &&
        !ownerState.forceVertical &&
        css`
            width: calc(100% / 3);
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

const InputContainer = createComponentSlot("div")<FieldContainerClassKey, OwnerState>({
    componentName: "FormFieldContainer",
    slotName: "inputContainer",
})(
    ({ ownerState }) => css`
        ${ownerState.variant === "horizontal" &&
        ownerState.fullWidth &&
        !ownerState.forceVertical &&
        css`
            flex-grow: 1;
        `}
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
        helperText,
        scrollTo = false,
        fieldMargin = "onlyIfNotLast",
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminFormFieldContainer" });

    const hasError = !!error;
    const hasWarning = !hasError && !!warning;

    const ref = React.useRef<HTMLDivElement>(null);
    const rootWidth = useObservedWidth(ref);
    const forceVertical = rootWidth <= 600;

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
        forceVertical,
    };

    return (
        <Root ownerState={ownerState} fullWidth={fullWidth} disabled={disabled} required={required} ref={ref} {...slotProps?.root} {...restProps}>
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
                    {helperText && !hasError && !hasWarning && <HelperText {...slotProps?.helperText}>{helperText}</HelperText>}
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
        CometAdminFormFieldContainer: FieldContainerProps;
    }

    interface Components {
        CometAdminFormFieldContainer?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFormFieldContainer"]>;
            styleOverrides?: ComponentsOverrides["CometAdminFormFieldContainer"];
        };
    }
}
