import { ButtonProps } from "@material-ui/core/Button";
import { Theme } from "@material-ui/core/styles";
import { Check, Error, HourglassFull, Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { ClassNameMap } from "@material-ui/styles/withStyles/withStyles";
import * as React from "react";

import { useComponentThemeProps } from "../../../mui/useComponentThemeProps";
import { SaveButtonDisplayState } from "./SaveButton";

export interface CometAdminSaveButtonThemeProps {
    saveIcon?: React.ReactNode;
    savingIcon?: React.ReactNode;
    successIcon?: React.ReactNode;
    errorIcon?: React.ReactNode;
}

export type CometAdminSaveButtonClassKeys = "saving" | "error" | "success" | "disabled";

export const useStyles = (props: { color: ButtonProps["color"] }) => {
    return makeStyles<Theme, {}, CometAdminSaveButtonClassKeys>(
        (theme) => {
            return {
                saving: {
                    "&$disabled": {
                        color: props.color === "primary" ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
                        backgroundColor: props.color === "primary" ? theme.palette.primary.main : theme.palette.secondary.main,
                    },
                },
                error: {
                    "&$disabled": {
                        color: theme.palette.error.contrastText,
                        backgroundColor: theme.palette.error.light,
                    },
                },
                success: {
                    "&$disabled": {
                        color: theme.palette.success.contrastText,
                        backgroundColor: theme.palette.success.light,
                    },
                },
                disabled: {},
            };
        },
        { name: "CometAdminSaveButton" },
    )();
};

export function useThemeProps() {
    const { saveIcon = <Save />, savingIcon = <HourglassFull />, successIcon = <Check />, errorIcon = <Error />, ...restProps } =
        useComponentThemeProps("CometAdminSaveButton") ?? {};

    const resolveIconForDisplayState = (displayState: SaveButtonDisplayState): React.ReactNode => {
        if (displayState === "saving") {
            return savingIcon;
        } else if (displayState === "success") {
            return successIcon;
        } else if (displayState === "error") {
            return errorIcon;
        }
        return saveIcon;
    };
    return { resolveIconForDisplayState, saveIcon, savingIcon, successIcon, errorIcon, ...restProps };
}

export const resolveClassForDisplayState = (
    displayState: SaveButtonDisplayState,
    styles: ReturnType<typeof useStyles>,
): Partial<ClassNameMap<string>> => {
    let rootClass = undefined;

    if (displayState === "success") {
        rootClass = styles.success;
    } else if (displayState === "saving") {
        rootClass = styles.saving;
    } else if (displayState === "error") {
        rootClass = styles.error;
    }
    return {
        root: rootClass,
        disabled: styles.disabled,
    };
};

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminSaveButton: CometAdminSaveButtonClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminSaveButton: CometAdminSaveButtonThemeProps;
    }
}
