import { ComponentsOverrides, CssBaseline } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import { ComponentType, CSSProperties, ReactNode, useState } from "react";

import { AppHeader } from "../appHeader/AppHeader";
import { AppHeaderMenuButton } from "../appHeader/menuButton/AppHeaderMenuButton";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { MasterLayoutContext } from "./MasterLayoutContext";
import { MenuContext } from "./menu/Context";

export type MasterLayoutClassKey = "root" | "header" | "contentWrapper";

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

const ContentWrapper = createComponentSlot("div")<MasterLayoutClassKey>({
    componentName: "MasterLayout",
    slotName: "contentWrapper",
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

    const toggleOpen = () => {
        setOpen(!open);
    };

    return (
        <MenuContext.Provider value={{ open, toggleOpen, drawerVariant, setDrawerVariant }}>
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
                    <Menu />
                    <ContentWrapper
                        {...slotProps?.contentWrapper}
                        style={{ "--comet-admin-master-layout-content-top-spacing": `${headerHeight}px` } as CSSProperties}
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
        CometAdminMasterLayout: MasterLayoutProps;
    }

    interface Components {
        CometAdminMasterLayout?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMasterLayout"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMasterLayout"];
        };
    }
}
