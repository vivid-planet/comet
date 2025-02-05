import { type ComponentsOverrides, CssBaseline } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { type ComponentType, type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import { AppHeader } from "../appHeader/AppHeader";
import { AppHeaderMenuButton } from "../appHeader/menuButton/AppHeaderMenuButton";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { MainNavigationContext } from "./mainNavigation/Context";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { MasterLayoutContext } from "./MasterLayoutContext";

export type MasterLayoutClassKey = "root" | "header" | "menuWrapper" | "contentWrapper";

const Root = createComponentSlot("div")<MasterLayoutClassKey>({
    componentName: "MasterLayout",
    slotName: "root",
})(css`
    display: flex;
    flex-wrap: nowrap;
`);

const Header = createComponentSlot("div")<MasterLayoutClassKey>({
    componentName: "MasterLayout",
    slotName: "header",
})(
    ({ theme }) => css`
        z-index: ${theme.zIndex.drawer - 10};
    `,
);

const MenuWrapper = createComponentSlot("div")<MasterLayoutClassKey>({
    componentName: "MasterLayout",
    slotName: "menuWrapper",
})();

const ContentWrapper = createComponentSlot("div")<MasterLayoutClassKey>({
    componentName: "MasterLayout",
    slotName: "contentWrapper",
})(css`
    flex-grow: 1;
    padding-top: var(--comet-admin-master-layout-content-top-spacing);
    width: calc(100% - var(--comet-admin-master-layout-menu-width));
`);

export interface MasterLayoutProps
    extends ThemedComponentBaseProps<{
        root: "div";
        header: "div";
        menuWrapper: "div";
        contentWrapper: "div";
    }> {
    children: ReactNode;
    menuComponent: ComponentType;
    headerComponent?: ComponentType;
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

    const [open, setOpen] = useState(openMenuByDefault);
    const [drawerVariant, setDrawerVariant] = useState<"permanent" | "temporary">("permanent");
    const [menuWidth, setMenuWidth] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuRef.current) return;

        const resizeObserver = new ResizeObserver(([entry]) => {
            if (entry) {
                setMenuWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(menuRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const toggleOpen = () => {
        setOpen(!open);
    };

    return (
        <MainNavigationContext.Provider value={{ open, toggleOpen, drawerVariant, setDrawerVariant }}>
            <MasterLayoutContext.Provider value={{ headerHeight }}>
                <CssBaseline />
                <Root {...slotProps?.root} {...restProps}>
                    <Header {...slotProps?.header}>
                        {HeaderComponent ? (
                            <HeaderComponent />
                        ) : (
                            <AppHeader>
                                <AppHeaderMenuButton onClick={toggleOpen} />
                            </AppHeader>
                        )}
                    </Header>
                    <MenuWrapper {...slotProps?.menuWrapper} ref={menuRef}>
                        <Menu />
                    </MenuWrapper>
                    <ContentWrapper
                        {...slotProps?.contentWrapper}
                        style={
                            {
                                "--comet-admin-master-layout-content-top-spacing": `${headerHeight}px`,
                                "--comet-admin-master-layout-menu-width": `${menuWidth}px`,
                            } as CSSProperties
                        }
                    >
                        {children}
                    </ContentWrapper>
                </Root>
            </MasterLayoutContext.Provider>
        </MainNavigationContext.Provider>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMasterLayout: MasterLayoutClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMasterLayout: MasterLayoutProps;
    }

    interface Components {
        CometAdminMasterLayout?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMasterLayout"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMasterLayout"];
        };
    }
}
