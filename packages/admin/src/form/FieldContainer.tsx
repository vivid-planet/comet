import { FormControl, FormHelperText, FormLabel, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

export interface FieldContainerThemeProps {
    variant?: "vertical" | "horizontal";
    requiredSymbol?: React.ReactNode;
}

interface FieldContainerProps {
    label?: string | React.ReactNode;
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

export const useFieldContainerStyles = makeStyles<Theme, {}, CometAdminFormFieldContainerClassKeys>(
    (theme) => ({
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
    }),
    { name: "CometAdminFormFieldContainer" },
);

export const FieldContainer: React.FC<FieldContainerProps & FieldContainerThemeProps> = ({
    variant = "vertical",
    label,
    error,
    disabled,
    required,
    requiredSymbol = "*",
    children,
}) => {
    const classes = useFieldContainerStyles();
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
