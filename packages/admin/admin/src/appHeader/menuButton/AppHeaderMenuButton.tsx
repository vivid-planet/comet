import { Hamburger } from "@comet/admin-icons";
import { ComponentsOverrides, IconButton, IconButtonClassKey, IconButtonProps, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
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
        sizeMedium: {},
        sizeLarge: {},
    });
};

function MenuButton({
    children = <Hamburger fontSize="large" />,
    classes,
    ...restProps
}: AppHeaderMenuButtonProps & WithStyles<typeof styles>): React.ReactElement {
    const { toggleOpen } = React.useContext(MenuContext);

    return (
        <IconButton classes={classes} onClick={() => toggleOpen()} {...restProps} size="large">
            {children}
        </IconButton>
    );
}

export const AppHeaderMenuButton = withStyles(styles, { name: "CometAdminAppHeaderMenuButton" })(MenuButton);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderMenuButton: AppHeaderMenuButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminAppHeaderMenuButton: AppHeaderMenuButtonProps;
    }

    interface Components {
        CometAdminAppHeaderMenuButton?: {
            defaultProps?: ComponentsPropsList["CometAdminAppHeaderMenuButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminAppHeaderMenuButton"];
        };
    }
}
