import { Hamburger } from "@comet/admin-icons";
import { IconButton, IconButtonClassKey, IconButtonProps, Theme, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

import { MenuContext } from "../../mui/menu/Context";

export type AppHeaderMenuButtonProps = IconButtonProps;

export type AppHeaderMenuButtonClassKey = IconButtonClassKey;

const styles = ({ spacing }: Theme) => {
    return createStyles<AppHeaderMenuButtonClassKey, AppHeaderMenuButtonProps>({
        root: {
            color: "#fff",
            marginLeft: spacing(2),
            marginRight: spacing(2),
        },
        edgeStart: {},
        edgeEnd: {},
        colorInherit: {},
        colorPrimary: {},
        colorSecondary: {},
        disabled: {},
        sizeSmall: {},
        label: {},
    });
};

function MenuButton({
    children = <Hamburger fontSize="large" />,
    classes,
    ...restProps
}: AppHeaderMenuButtonProps & WithStyles<typeof styles>): React.ReactElement {
    const { toggleOpen } = React.useContext(MenuContext);

    return (
        <IconButton classes={classes} onClick={() => toggleOpen()} {...restProps}>
            {children}
        </IconButton>
    );
}

export const AppHeaderMenuButton = withStyles(styles, { name: "CometAdminAppHeaderMenuButton" })(MenuButton);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderMenuButton: AppHeaderMenuButtonClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminAppHeaderMenuButton: AppHeaderMenuButtonProps;
    }
}
