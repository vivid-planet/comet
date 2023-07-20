import { AppBar as MuiAppBar, AppBarClassKey, capitalize, ComponentsOverrides, Theme, useThemeProps } from "@mui/material";
import { AppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { MasterLayoutContext } from "../mui/MasterLayoutContext";

interface AppHeaderProps extends AppBarProps {
    /**
     * A custom height should only be set, if used outside of MasterLayout.
     */
    headerHeight?: number;
}

export type AppHeaderClassKey = AppBarClassKey;

const AppHeaderRoot = styled(MuiAppBar, {
    name: "CometAdminAppHeader",
    slot: "Root",
    overridesResolver({ position, color }, styles) {
        return [styles.root, styles[`position${capitalize(position)}`], styles[`color${capitalize(color)}`]];
    },
})(({ theme }) => {
    return {
        backgroundColor: theme.palette.grey["A400"],
        height: "var(--header-height)",
        flexDirection: "row",
        alignItems: "center",
    };
});

export function AppHeader(inProps: AppHeaderProps): React.ReactElement {
    const props = useThemeProps({ props: inProps, name: "CometAdminAppHeader" });
    const { children, headerHeight: passedHeaderHeight, position = "fixed", color = "primary", ...restProps } = props;

    const { headerHeight: masterLayoutHeaderHeight } = React.useContext(MasterLayoutContext);
    const headerHeight = passedHeaderHeight === undefined ? masterLayoutHeaderHeight : passedHeaderHeight;

    return (
        <AppHeaderRoot position={position} color={color} {...restProps} style={{ "--header-height": `${headerHeight}px` } as React.CSSProperties}>
            {children}
        </AppHeaderRoot>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminAppHeader: AppHeaderClassKey;
    }

    interface ComponentsPropsList {
        CometAdminAppHeader: AppHeaderProps;
    }

    interface Components {
        CometAdminAppHeader?: {
            defaultProps?: ComponentsPropsList["CometAdminAppHeader"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminAppHeader"];
        };
    }
}
