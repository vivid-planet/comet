import { Close, Save } from "@comet/admin-icons";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { useComponentThemeProps } from "./mui/useComponentThemeProps";

export interface CometAdminCometAdminFinalFormSaveCancelButtonsLegacyThemeProps {
    cancelIcon?: React.ReactNode;
    saveIcon?: React.ReactNode;
}

export type CometAdminCometAdminFinalFormSaveCancelButtonsLegacyClassKeys = "root" | "cancelButton" | "saveButton";

export const useStyles = makeStyles<Theme, {}, CometAdminCometAdminFinalFormSaveCancelButtonsLegacyClassKeys>(
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
    { name: "CometAdminFinalFormSaveCancelButtonsLegacy" },
);

export function useThemeProps() {
    const { cancelIcon = <Close />, saveIcon = <Save />, ...restProps } = useComponentThemeProps("CometAdminFinalFormSaveCancelButtonsLegacy") ?? {};

    return { cancelIcon, saveIcon, ...restProps };
}

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormSaveCancelButtonsLegacy: CometAdminCometAdminFinalFormSaveCancelButtonsLegacyClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFinalFormSaveCancelButtonsLegacy: CometAdminCometAdminFinalFormSaveCancelButtonsLegacyThemeProps;
    }
}
