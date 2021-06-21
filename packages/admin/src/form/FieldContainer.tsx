import { FormControl, FormHelperText, FormLabel, Theme, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export interface FieldContainerThemeProps {
    variant?: "vertical" | "horizontal";
    fullWidth?: boolean;
    requiredSymbol?: React.ReactNode;
}

interface FieldContainerProps {
    label?: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    warning?: string;
}

export type CometAdminFormFieldContainerClassKeys =
    | "root"
    | "vertical"
    | "horizontal"
    | "fullWidth"
    | "required"
    | "disabled"
    | "label"
    | "inputContainer"
    | "hasError"
    | "error"
    | "hasWarning"
    | "warning";

const styles = (theme: Theme) => {
    return createStyles<CometAdminFormFieldContainerClassKeys, any>({
        root: {
            "&:not(:last-child)": {
                marginBottom: theme.spacing(4),
            },
            "& [class*='MuiInputBase-root']": {
                width: "100%",
            },
        },
        vertical: {
            "& $label": {
                marginBottom: theme.spacing(2),
            },
        },
        horizontal: {
            flexDirection: "row",
            alignItems: "center",
            "& $label": {
                width: 220,
                flexShrink: 0,
                flexGrow: 0,
            },
            "&$fullWidth $inputContainer": {
                flexGrow: 1,
            },
        },
        fullWidth: {},
        required: {},
        disabled: {},
        label: {
            display: "block",
            color: theme.palette.grey[900],
            fontSize: 16,
            lineHeight: "19px",
            fontWeight: theme.typography.fontWeightMedium,
        },
        inputContainer: {},
        hasError: {
            "& $label:not([class*='Mui-focused'])": {
                color: theme.palette.error.main,
            },
            "& [class*='MuiInputBase-root']:not([class*='MuiInputBase-focused'])": {
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
            "& [class*='MuiInputBase-root']:not([class*='MuiInputBase-focused'])": {
                borderColor: theme.palette.warning.main,
            },
        },
        warning: {
            fontSize: 14,
        },
    });
};

export const FieldContainerComponent: React.FC<WithStyles<typeof styles, true> & FieldContainerProps & FieldContainerThemeProps> = ({
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
}) => {
    const hasError = error !== undefined && error.length > 0;
    const hasWarning = warning !== undefined && warning.length > 0;

    const formControlClasses: string[] = [classes.root];
    if (variant === "vertical") formControlClasses.push(classes.vertical);
    if (variant === "horizontal") formControlClasses.push(classes.horizontal);
    if (fullWidth) formControlClasses.push(classes.fullWidth);
    if (hasError) formControlClasses.push(classes.hasError);
    if (hasWarning && !hasError) formControlClasses.push(classes.hasWarning);
    if (disabled) formControlClasses.push(classes.disabled);
    if (required) formControlClasses.push(classes.required);

    return (
        <FormControl fullWidth={fullWidth} classes={{ root: formControlClasses.join(" ") }}>
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

export const FieldContainer = withStyles(styles, { name: "CometAdminFormFieldContainer", withTheme: true })(FieldContainerComponent);
