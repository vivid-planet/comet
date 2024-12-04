import {
    FormControl,
    FormHelperText,
    formHelperTextClasses,
    FormLabel,
    formLabelClasses,
    inputBaseClasses,
    svgIconClasses,
    useThemeProps,
} from "@mui/material";
import { ComponentsOverrides, css, Theme } from "@mui/material/styles";
import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";

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
    secondaryHelperText: typeof FormHelperText;
    helperTextsWrapper: "div";
    helperTextContent: "span";
}> & {
    variant?: "vertical" | "horizontal";
    fullWidth?: boolean;
    label?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    warning?: string;
    scrollTo?: boolean;
    fieldMargin?: "always" | "never" | "onlyIfNotLast";
    helperText?: ReactNode;
    secondaryHelperText?: ReactNode;
    helperTextIcon?: ReactNode;
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
    | "helperText"
    | "secondaryHelperText"
    | "helperTextsWrapper"
    | "helperTextContent";

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
            (ownerState.variant === "vertical" || ownerState.forceVertical) && "vertical",
            ownerState.variant === "horizontal" && !ownerState.forceVertical && "horizontal",
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

        ${ownerState.fieldMargin !== "never" &&
        css`
            margin-bottom: ${theme.spacing(4)};
            ${!ownerState.fullWidth &&
            css`
                margin-right: ${theme.spacing(4)};
            `}
        `}

        ${ownerState.variant === "horizontal" &&
        !ownerState.forceVertical &&
        css`
            display: flex;
            flex-direction: row;
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
            margin-top: ${theme.spacing(2)};
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

        ${ownerState.variant === "horizontal" &&
        !ownerState.forceVertical &&
        css`
            min-height: 40px;

            > .CometAdminFormFieldContainer-root {
                margin-bottom: 0;
            }
        `}

        & > [class*="${inputBaseClasses.root}"] {
            width: 100%;
        }
    `,
);

const getCommonHelperTextStyles = (theme: Theme) => css`
    &.${formHelperTextClasses.root} {
        gap: ${theme.spacing(1)};
    }

    > .${svgIconClasses.root} {
        width: 12px;
    }
`;

const Error = createComponentSlot(FormHelperText)<FieldContainerClassKey>({
    componentName: "FormFieldContainer",
    slotName: "error",
})(
    ({ theme }) => css`
        ${getCommonHelperTextStyles(theme)}
    `,
);

const Warning = createComponentSlot(FormHelperText)<FieldContainerClassKey>({
    componentName: "FormFieldContainer",
    slotName: "warning",
})(
    ({ theme }) => css`
        ${getCommonHelperTextStyles(theme)}
        color: ${theme.palette.warning.main};
    `,
);

const HelperText = createComponentSlot(FormHelperText)<FieldContainerClassKey>({
    componentName: "FormFieldContainer",
    slotName: "helperText",
})(
    ({ theme }) => css`
        ${getCommonHelperTextStyles(theme)}
        color: ${theme.palette.grey[300]};
    `,
);

const SecondaryHelperText = createComponentSlot(FormHelperText)<FieldContainerClassKey>({
    componentName: "FormFieldContainer",
    slotName: "secondaryHelperText",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[300]};
        margin-left: auto;

        &.Mui-disabled {
            color: ${theme.palette.grey[300]};
        }
    `,
);

const HelperTextsWrapper = createComponentSlot("div")<FieldContainerClassKey>({
    componentName: "FormFieldContainer",
    slotName: "helperTextsWrapper",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${theme.spacing(3)};
    `,
);

const HelperTextContent = createComponentSlot("span")<FieldContainerClassKey>({
    componentName: "FormFieldContainer",
    slotName: "helperTextContent",
})();

export const FieldContainer = (inProps: PropsWithChildren<FieldContainerProps>) => {
    const {
        variant = "vertical",
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
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminFormFieldContainer" });
    const fullWidth = passedFullWidth ?? variant === "horizontal";

    const hasError = !!error;
    const hasWarning = !hasError && !!warning;

    const ref = useRef<HTMLDivElement>(null);
    const rootWidth = useObservedWidth(ref);
    const forceVertical = rootWidth <= 600;

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
        forceVertical,
    };

    return (
        <Root ownerState={ownerState} fullWidth={fullWidth} disabled={disabled} required={required} ref={ref} {...slotProps?.root} {...restProps}>
            <>
                {(label || (variant === "horizontal" && !forceVertical)) && (
                    <Label ownerState={ownerState} disabled={disabled} {...slotProps?.label}>
                        {label}
                    </Label>
                )}
                <InputContainer ownerState={ownerState} {...slotProps?.inputContainer}>
                    {children}
                    <HelperTextsWrapper {...slotProps?.helperTextsWrapper}>
                        {hasError && (
                            <Error error {...slotProps?.error}>
                                {Boolean(helperTextIcon) && helperTextIcon}
                                <HelperTextContent {...slotProps?.helperTextContent}>{error}</HelperTextContent>
                            </Error>
                        )}
                        {hasWarning && !hasError && (
                            <Warning {...slotProps?.warning}>
                                {Boolean(helperTextIcon) && helperTextIcon}
                                <HelperTextContent {...slotProps?.helperTextContent}>{warning}</HelperTextContent>
                            </Warning>
                        )}
                        {Boolean(helperText) && !hasError && !hasWarning && (
                            <HelperText {...slotProps?.helperText}>
                                {Boolean(helperTextIcon) && helperTextIcon}
                                <HelperTextContent {...slotProps?.helperTextContent}>{helperText}</HelperTextContent>
                            </HelperText>
                        )}
                        {Boolean(secondaryHelperText) && (
                            <SecondaryHelperText {...slotProps?.secondaryHelperText}>{secondaryHelperText}</SecondaryHelperText>
                        )}
                    </HelperTextsWrapper>
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
