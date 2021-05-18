import { Theme } from "@material-ui/core/styles";
import { Check, Error, HourglassFull, Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { useComponentThemeProps } from "../../../mui/useComponentThemeProps";
import { DisplayStateSaveSplitButton } from "./SaveSplitButton";

export interface CometAdminSaveSplitButtonThemeProps {
    saveIcon?: React.ReactNode;
    savingIcon?: React.ReactNode;
    successIcon?: React.ReactNode;
    errorIcon?: React.ReactNode;
}

export type CometAdminSaveSplitButtonClassKeys = "saving" | "error" | "success" | "disabled";

export const useStyles = makeStyles<Theme, {}, CometAdminSaveSplitButtonClassKeys>(
    (theme) => ({
        saving: {
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
                backgroundColor: theme.palette.primary.light,
            },
            "&$disabled": {
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.primary.main,
            },
        },
        error: {
            backgroundColor: theme.palette.error.main,
            "&:hover": {
                backgroundColor: theme.palette.error.light,
            },
            "&$disabled": {
                color: theme.palette.error.contrastText,
                backgroundColor: theme.palette.error.light,
            },
        },
        success: {
            backgroundColor: theme.palette.success.main,
            "&:hover": {
                backgroundColor: theme.palette.success.light,
            },
            "&$disabled": {
                color: theme.palette.success.contrastText,
                backgroundColor: theme.palette.success.light,
            },
        },
        disabled: {},
    }),
    { name: "CometAdminSaveSplitButton" },
);

export function useThemeProps() {
    const { saveIcon = <Save />, savingIcon = <HourglassFull />, successIcon = <Check />, errorIcon = <Error />, ...restProps } =
        useComponentThemeProps("CometAdminSaveSplitButton") ?? {};

    const resolveIconForDisplayState = (displayState: DisplayStateSaveSplitButton): React.ReactNode => {
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

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminSaveSplitButton: CometAdminSaveSplitButtonClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminSaveSplitButton: CometAdminSaveSplitButtonThemeProps;
    }
}
