import { Theme } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { useComponentThemeProps } from "../mui/useComponentThemeProps";

export interface CometAdminFinalFormSearchTextFieldThemeProps {
    icon?: React.ReactNode;
}

export type CometAdminFinalFormSearchTextFieldClassKeys = "iconContainer";

export const useStyles = makeStyles<Theme, {}, CometAdminFinalFormSearchTextFieldClassKeys>(
    () => ({
        iconContainer: {},
    }),
    { name: "CometAdminFinalFormSearchTextField" },
);

export function useThemeProps() {
    const { icon = <Search />, ...restProps } =
        useComponentThemeProps<CometAdminFinalFormSearchTextFieldThemeProps>("CometAdminFinalFormSearchTextField") ?? {};
    return { icon, ...restProps };
}

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormSearchTextField: CometAdminFinalFormSearchTextFieldClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminFinalFormSearchTextField: CometAdminFinalFormSearchTextFieldThemeProps;
    }
}
