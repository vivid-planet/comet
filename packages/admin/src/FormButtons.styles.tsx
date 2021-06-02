import { Theme } from "@material-ui/core/styles";
import { Cancel, Save } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { useComponentThemeProps } from "./mui/useComponentThemeProps";

export interface CometAdminFormButtonsThemeProps {
    cancelIcon?: React.ReactNode;
    saveIcon?: React.ReactNode;
}

export type CometAdminFormButtonsClassKeys = "root" | "cancelButton" | "saveButton";

export const useStyles = makeStyles<Theme, {}, CometAdminFormButtonsClassKeys>(
    (theme) => {
        return {
            root: {},
            cancelButton: {
                margin: theme.spacing(1),
            },
            saveButton: {
                margin: theme.spacing(1),
            },
        };
    },
    { name: "CometAdminFormButtons" },
);

export function useThemeProps() {
    const { cancelIcon = <Cancel />, saveIcon = <Save />, ...restProps } = useComponentThemeProps("CometAdminFormButtons") ?? {};

    return { cancelIcon, saveIcon, ...restProps };
}

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFormButtons: CometAdminFormButtonsClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFormButtons: CometAdminFormButtonsThemeProps;
    }
}
