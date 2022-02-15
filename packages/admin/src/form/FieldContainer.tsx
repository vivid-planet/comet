import { FormControl, FormHelperText, FormLabel, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export interface FieldContainerProps {
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
}

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

const styles = (theme: Theme) => {
    return createStyles<FieldContainerClassKey, FieldContainerProps>({
        root: {
            "&:not($fieldMarginNever)": {
                marginBottom: theme.spacing(4),
                "&:not($fullWidth)": {
                    marginRight: theme.spacing(4),
                },
            },
            "& [class*='MuiInputBase-root']": {
                width: "100%",
            },
        },
        vertical: {},
        horizontal: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            "& $label": {
                width: 220,
                flexShrink: 0,
                flexGrow: 0,
                marginBottom: 0,
            },
            "&$fullWidth $inputContainer": {
                flexGrow: 1,
            },
        },
        fullWidth: {},
        required: {},
        disabled: {
            "& $label": {
                color: theme.palette.text.disabled,
            },
        },
        fieldMarginAlways: {},
        fieldMarginNever: {},
        fieldMarginOnlyIfNotLast: {
            "&:last-child": {
                marginBottom: 0,
                "&:not($fullWidth)": {
                    marginRight: 0,
                },
            },
        },
        label: {},
        inputContainer: {},
        hasError: {
            "& $label:not([class*='Mui-focused'])": {
                color: theme.palette.error.main,
            },
            "& [class*='MuiInputBase-root']:not([class*='Mui-focused'])": {
                borderColor: theme.palette.error.main,
            },
        },
        error: {
            fontSize: 14,
        },
        hasWarning: {
            "& $label:not([class*='Mui-focused'])": {
                color: theme.palette.warning.main,
            },
            "& [class*='MuiInputBase-root']:not([class*='Mui-focused'])": {
                borderColor: theme.palette.warning.main,
            },
        },
        warning: {
            fontSize: 14,
            color: theme.palette.warning.main,
        },
    });
};

export const FieldContainerComponent: React.FC<WithStyles<typeof styles> & FieldContainerProps> = ({
    classes,
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
}) => {
    const hasError = !!error;
    const hasWarning = !!warning;

    const formControlClasses: string[] = [classes.root];
    if (variant === "vertical") formControlClasses.push(classes.vertical);
    if (variant === "horizontal") formControlClasses.push(classes.horizontal);
    if (fullWidth) formControlClasses.push(classes.fullWidth);
    if (hasError) formControlClasses.push(classes.hasError);
    if (hasWarning && !hasError) formControlClasses.push(classes.hasWarning);
    if (disabled) formControlClasses.push(classes.disabled);
    if (required) formControlClasses.push(classes.required);
    if (fieldMargin === "always") formControlClasses.push(classes.fieldMarginAlways);
    if (fieldMargin === "never") formControlClasses.push(classes.fieldMarginNever);
    if (fieldMargin === "onlyIfNotLast") formControlClasses.push(classes.fieldMarginOnlyIfNotLast);

    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollTo) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollTo]);

    return (
        <FormControl fullWidth={fullWidth} classes={{ root: formControlClasses.join(" ") }} ref={ref}>
            <>
                {label && (
                    <FormLabel classes={{ root: classes.label }}>
                        {label}
                        {required && requiredSymbol}
                    </FormLabel>
                )}
                <div className={classes.inputContainer}>
                    {children}
                    {hasError && (
                        <FormHelperText error classes={{ root: classes.error }}>
                            {error}
                        </FormHelperText>
                    )}
                    {hasWarning && !hasError && <FormHelperText classes={{ root: classes.warning }}>{warning}</FormHelperText>}
                </div>
            </>
        </FormControl>
    );
};

export const FieldContainer = withStyles(styles, { name: "CometAdminFormFieldContainer" })(FieldContainerComponent);

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFormFieldContainer: FieldContainerClassKey;
    }
}

declare module "@mui/material/styles/props" {
    interface ComponentsPropsList {
        CometAdminFormFieldContainer: FieldContainerProps;
    }
}
