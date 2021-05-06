import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

import { useComponentThemeProps } from "../../mui/useComponentThemeProps";

export interface ToolbarThemeProps {
    elevation?: number;
}

export type CometAdminToolbarClassKeys = "root" | "muiToolbar" | "mainContentContainer";

export const useStyles = makeStyles<Theme, { headerHeight: number }, CometAdminToolbarClassKeys>(
    () => ({
        root: {
            position: "sticky",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            top: (props) => props.headerHeight,
            padding: 0,
        },
        muiToolbar: {
            display: "flex",
            flex: 1,
            alignItems: "stretch",
        },
        mainContentContainer: {
            display: "flex",
            flex: 1,
        },
    }),
    { name: "CometAdminToolbar" },
);

export function useThemeProps() {
    const { elevation = 4, ...restProps } = useComponentThemeProps<ToolbarThemeProps>("CometAdminToolbar") ?? {};
    return { elevation, ...restProps };
}

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbar: CometAdminToolbarClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbar: ToolbarThemeProps;
    }
}
