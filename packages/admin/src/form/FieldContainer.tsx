import { FormControl, FormHelperText, FormLabel, Theme, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

export interface FieldContainerThemeProps {
    variant?: "vertical" | "horizontal";
    requiredSymbol?: React.ReactNode;
}

interface FieldContainerProps {
    label?: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    error?: string;
}

export type CometAdminFormFieldContainerClassKeys =
    | "root"
    | "vertical"
    | "horizontal"
    | "required"
    | "disabled"
    | "label"
    | "inputContainer"
    | "hasError"
    | "error";

const styles = (theme: Theme) => {
    return createStyles<CometAdminFormFieldContainerClassKeys, any>({
        root: {
            "&:not(:last-child)": {
                marginBottom: theme.spacing(3),
            },
        },
        vertical: {
            "& $label": {
                marginBottom: theme.spacing(1),
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
        },
        required: {},
        disabled: {},
        label: {
            display: "block",
        },
        inputContainer: {},
        hasError: {},
        error: {},
    });
};

export const FieldContainerComponent: React.FC<WithStyles<typeof styles, true> & FieldContainerProps & FieldContainerThemeProps> = ({
    classes,
    variant = "vertical",
    label,
    error,
    disabled,
    required,
    requiredSymbol = "*",
    children,
}) => {
    const formControlClasses: string[] = [classes.root];
    if (variant === "vertical") formControlClasses.push(classes.vertical);
    if (variant === "horizontal") formControlClasses.push(classes.horizontal);
    if (error) formControlClasses.push(classes.hasError);
    if (disabled) formControlClasses.push(classes.disabled);
    if (required) formControlClasses.push(classes.required);

    return (
        <FormControl fullWidth classes={{ root: formControlClasses.join(" ") }}>
            <>
                {label && (
                    <FormLabel classes={{ root: classes.label }}>
                        {label}
                        {required && requiredSymbol}
                    </FormLabel>
                )}
                <div className={classes.inputContainer}>
                    {children}
                    {!!error && (
                        <FormHelperText error classes={{ root: classes.error }}>
                            {error}
                        </FormHelperText>
                    )}
                </div>
            </>
        </FormControl>
    );
};

export const FieldContainer = withStyles(styles, { name: "CometAdminFormFieldContainer", withTheme: true })(FieldContainerComponent);
