import { Hamburger } from "@comet/admin-icons";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../helpers/mergeClasses";
import { MenuContext } from "../../mui/menu/Context";
import { CometAdminAppHeaderMenuButtonClassKeys, useStyles } from "./AppHeaderMenuButton.styles";

export interface AppHeaderMenuButtonThemeProps extends IconButtonProps {}

export function AppHeaderMenuButton({
    children = <Hamburger fontSize="large" />,
    classes: passedClasses,
    ...restProps
}: AppHeaderMenuButtonThemeProps & StyledComponentProps<CometAdminAppHeaderMenuButtonClassKeys>): React.ReactElement {
    const classes = mergeClasses<CometAdminAppHeaderMenuButtonClassKeys>(useStyles(), passedClasses);
    const { toggleOpen } = React.useContext(MenuContext);

    return (
        <IconButton classes={classes} onClick={() => toggleOpen()} {...restProps}>
            {children}
        </IconButton>
    );
}
