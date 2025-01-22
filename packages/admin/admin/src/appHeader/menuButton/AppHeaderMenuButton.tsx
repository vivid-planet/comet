import { Close, Hamburger, HamburgerClose, HamburgerOpen } from "@comet/admin-icons";
import { ComponentsOverrides, css, IconButton, IconButtonClassKey, IconButtonProps, Theme, useThemeProps } from "@mui/material";
import { ReactNode } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { useMainNavigation } from "../../mui/mainNavigation/Context";

export type AppHeaderMenuButtonProps = IconButtonProps;

export type AppHeaderMenuButtonClassKey = IconButtonClassKey;

export const AppHeaderMenuButton = (inProps: AppHeaderMenuButtonProps) => {
    const { children: propChildren, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminAppHeaderMenuButton" });
    const { toggleOpen, open, drawerVariant } = useMainNavigation();

    const closeIcons: Record<typeof drawerVariant, ReactNode> = {
        temporary: <Close />,
        permanent: <HamburgerClose fontSize="large" />,
    };

    const openIcons: Record<typeof drawerVariant, ReactNode> = {
        temporary: <Hamburger />,
        permanent: <HamburgerOpen fontSize="large" />,
    };

    const children = propChildren || (open ? closeIcons[drawerVariant] : openIcons[drawerVariant]);

    return (
        <Root onClick={toggleOpen} size="large" {...restProps}>
            {children}
        </Root>
    );
};

const Root = createComponentSlot(IconButton)<AppHeaderMenuButtonClassKey>({
    componentName: "AppHeaderMenuButton",
    slotName: "root",
})(
    ({ theme }) => css`
        color: #fff;
        margin-left: ${theme.spacing(3)};
        margin-right: ${theme.spacing(3)};
        padding: 8px;
        border-radius: 4px;
        border: 1px solid ${theme.palette.grey.A200};
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
