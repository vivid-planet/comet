import { ComponentsOverrides, CssBaseline } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { AppHeader } from "../appHeader/AppHeader";
import { AppHeaderMenuButton } from "../appHeader/menuButton/AppHeaderMenuButton";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { MasterLayoutContext } from "./MasterLayoutContext";
import { MenuContext } from "./menu/Context";

export type MasterLayoutClassKey = "root" | "header" | "contentWrapper";

const Root = styled("div", {
    name: "CometAdminMasterLayout",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    display: flex;
    flex-wrap: nowrap;
`);

const Header = styled("div", {
    name: "CometAdminMasterLayout",
    slot: "header",
    overridesResolver(_, styles) {
        return [styles.header];
    },
})(
    ({ theme }) => css`
        z-index: ${theme.zIndex.drawer - 10};
    `,
);

const ContentWrapper = styled("div", {
    name: "CometAdminMasterLayout",
    slot: "contentWrapper",
    overridesResolver(_, styles) {
        return [styles.contentWrapper];
    },
})(css`
    flex-grow: 1;
    padding-top: var(--comet-admin-master-layout-content-top-spacing);
`);

export interface MasterLayoutProps
    extends ThemedComponentBaseProps<{
        root: "div";
        header: "div";
        contentWrapper: "div";
    }> {
    children: React.ReactNode;
    menuComponent: React.ComponentType;
    headerComponent?: React.ComponentType;
    openMenuByDefault?: boolean;
    /**
     * Defines the global header-height. The value defined here will also be used by AppHeader and Toolbar.
     */
    headerHeight?: number;
}

export function MasterLayout(inProps: MasterLayoutProps) {
    const {
        children,
        menuComponent: Menu,
        headerComponent: HeaderComponent,
        openMenuByDefault = true,
        headerHeight = 60,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminMasterLayout" });

    const [open, setOpen] = React.useState(openMenuByDefault);

    const toggleOpen = () => {
        setOpen(!open);
    };

    return (
        <MenuContext.Provider value={{ open, toggleOpen }}>
            <MasterLayoutContext.Provider value={{ headerHeight }}>
                <CssBaseline />
                <Root {...restProps} {...slotProps?.root}>
                    <Header {...slotProps?.header}>
                        {HeaderComponent ? (
                            <HeaderComponent />
                        ) : (
                            <AppHeader>
                                <AppHeaderMenuButton onClick={toggleOpen} />
                            </AppHeader>
                        )}
                    </Header>
                    <Menu />
                    <ContentWrapper
                        {...slotProps?.contentWrapper}
                        style={{ "--comet-admin-master-layout-content-top-spacing": `${headerHeight}px` } as React.CSSProperties}
                    >
                        {children}
                    </ContentWrapper>
                </Root>
            </MasterLayoutContext.Provider>
        </MenuContext.Provider>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMasterLayout: MasterLayoutClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMasterLayout: Partial<MasterLayoutProps>;
    }

    interface Components {
        CometAdminMasterLayout?: {
            defaultProps?: ComponentsPropsList["CometAdminMasterLayout"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMasterLayout"];
        };
    }
}
