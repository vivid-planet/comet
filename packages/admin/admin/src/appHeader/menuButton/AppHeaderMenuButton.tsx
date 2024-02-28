import { HamburgerClose, HamburgerOpen } from "@comet/admin-icons";
import { ComponentsOverrides, css, IconButton, IconButtonClassKey, IconButtonProps, styled, Theme, useThemeProps } from "@mui/material";
import * as React from "react";

import { MenuContext } from "../../mui/menu/Context";

export type AppHeaderMenuButtonProps = IconButtonProps;

export type AppHeaderMenuButtonClassKey = IconButtonClassKey;

export const AppHeaderMenuButton = (inProps: AppHeaderMenuButtonProps) => {
    const { children: propChildren, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminAppHeaderMenuButton" });
    const { toggleOpen, open } = React.useContext(MenuContext);

    const children = !propChildren ? open ? <HamburgerClose fontSize="large" /> : <HamburgerOpen fontSize="large" /> : propChildren;

    return (
        <Root onClick={toggleOpen} size="large" {...restProps}>
            {children}
        </Root>
    );
};

const Root = styled(IconButton, {
    name: "CometAdminAppHeaderMenuButton",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(
    ({ theme }) => css`
        color: #fff;
        margin-left: ${theme.spacing(2)};
        margin-right: ${theme.spacing(2)};
    `,
);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminAppHeaderMenuButton: AppHeaderMenuButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminAppHeaderMenuButton: AppHeaderMenuButtonProps;
    }

    interface Components {
        CometAdminAppHeaderMenuButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminAppHeaderMenuButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminAppHeaderMenuButton"];
        };
    }
}
