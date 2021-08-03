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
    scrollTo?: boolean;
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
        vertical: {},
        horizontal: {
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
        label: {},
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
    scrollTo = false,
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

    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollTo) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollTo]);

    const childrenWithDisabledProp = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { disabled });
        }
        return child;
    });

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
                    {childrenWithDisabledProp}
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
