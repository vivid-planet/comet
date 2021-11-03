import { AppBar, AppBarClassKey, WithStyles } from "@material-ui/core";
import { AppBarProps } from "@material-ui/core/AppBar";
import { Theme } from "@material-ui/core/styles";
import { createStyles, withStyles } from "@material-ui/styles";
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

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeader: AppHeaderClassKey;
    }
}
