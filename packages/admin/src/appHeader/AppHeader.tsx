import { AppBar, AppBarClassKey } from "@mui/material";
import { AppBarProps } from "@mui/material/AppBar";
import { Theme } from "@mui/material/styles";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { MasterLayoutContext } from "../mui/MasterLayoutContext";

interface AppHeaderProps extends AppBarProps {
    /**
     * A custom height should only be set, if used outside of MasterLayout.
     */
    headerHeight?: number;
}

export type AppHeaderClassKey = AppBarClassKey;

const styles = ({ palette }: Theme) => {
    return createStyles<AppHeaderClassKey, AppHeaderProps>({
        root: {
            backgroundColor: palette.grey["A400"],
            height: "var(--header-height)",
            flexDirection: "row",
            alignItems: "center",
        },
        positionFixed: {},
        positionAbsolute: {},
        positionSticky: {},
        positionStatic: {},
        positionRelative: {},
        colorDefault: {},
        colorPrimary: {},
        colorSecondary: {},
        colorInherit: {},
        colorTransparent: {},
    });
};

function Header({
    children,
    headerHeight: passedHeaderHeight,
    classes,
    ...restProps
}: AppHeaderProps & WithStyles<typeof styles>): React.ReactElement {
    const { headerHeight: masterLayoutHeaderHeight } = React.useContext(MasterLayoutContext);
    const headerHeight = passedHeaderHeight === undefined ? masterLayoutHeaderHeight : passedHeaderHeight;

    return (
        <AppBar classes={classes} {...restProps} style={{ "--header-height": `${headerHeight}px` } as React.CSSProperties}>
            {children}
        </AppBar>
    );
}

export const AppHeader = withStyles(styles, { name: "CometAdminAppHeader" })(Header);

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeader: AppHeaderClassKey;
    }
}
