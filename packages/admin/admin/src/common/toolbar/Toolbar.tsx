import { type ComponentsOverrides, Paper, Toolbar as MuiToolbar } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { isValidElement, type ReactNode, useContext } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MasterLayoutContext } from "../../mui/MasterLayoutContext";
import { StackBreadcrumbs, type StackBreadcrumbsProps } from "../../stack/breadcrumbs/StackBreadcrumbs";

export type ToolbarClassKey = "root" | "topBar" | "bottomBar" | "mainContentContainer" | "breadcrumbs" | "scopeIndicator";

export interface ToolbarProps
    extends ThemedComponentBaseProps<{
        root: typeof Paper;
        bottomBar: typeof MuiToolbar;
        mainContentContainer: "div";
        topBar: "div";
        breadcrumbs: typeof StackBreadcrumbs;
        scopeIndicator: "div";
    }> {
    elevation?: number;
    children?: ReactNode;
    scopeIndicator?: ReactNode;
    hideTopBar?: boolean;
    /**
     * The height of the header above the toolbar. Default behaviour is to use the height of the headerHeight from the
     * MasterLayoutContext, but can be overriden here
     */
    headerHeight?: number;
    stackBreadcrumbsProps?: StackBreadcrumbsProps;
}
type OwnerState = {
    headerHeight: number;
};

const Root = createComponentSlot(Paper)<ToolbarClassKey, OwnerState>({
    componentName: "Toolbar",
    slotName: "root",
})(
    ({ ownerState }) => css`
        position: sticky;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: center;
        top: ${ownerState.headerHeight}px;
        padding: 0;
    `,
);

const TopBar = createComponentSlot("div")<ToolbarClassKey>({
    componentName: "Toolbar",
    slotName: "topBar",
})(
    ({ theme }) => css`
        min-height: 40px;
        width: 100%;
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
        padding-left: ${theme.spacing(2)};
        padding-right: ${theme.spacing(2)};

        ${theme.breakpoints.up("sm")} {
            padding-left: ${theme.spacing(2)};
            padding-right: ${theme.spacing(2)};
        }

        ${theme.breakpoints.up("md")} {
            padding-left: ${theme.spacing(4)};
            padding-right: ${theme.spacing(4)};
        }
    `,
);

const ScopeIndicator = createComponentSlot("div")<ToolbarClassKey>({
    componentName: "Toolbar",
    slotName: "scopeIndicator",
})();

const BottomBar = createComponentSlot(MuiToolbar)<ToolbarClassKey>({
    componentName: "Toolbar",
    slotName: "bottomBar",
})(
    ({ theme }) => css`
        display: flex;
        flex: 1;
        align-items: stretch;
        border-top: solid 1px ${theme.palette.grey["50"]};
        box-sizing: border-box;
        min-height: 60px;
        padding-left: ${theme.spacing(2)};
        padding-right: ${theme.spacing(2)};

        ${theme.breakpoints.up("sm")} {
            min-height: 60px;
            padding-left: ${theme.spacing(2)};
            padding-right: ${theme.spacing(2)};
        }

        ${theme.breakpoints.up("md")} {
            padding-left: ${theme.spacing(4)};
            padding-right: ${theme.spacing(4)};
        }

        // necessary to override strange MUI default styling
        @media (min-width: 0px) and (orientation: landscape) {
            min-height: 60px;
        }
    `,
);

const MainContentContainer = createComponentSlot("div")<ToolbarClassKey>({
    componentName: "Toolbar",
    slotName: "mainContentContainer",
})(css`
    display: flex;
    flex: 1;
`);

const Breadcrumbs = createComponentSlot(StackBreadcrumbs)<ToolbarClassKey>({
    componentName: "Toolbar",
    slotName: "breadcrumbs",
})();

export const Toolbar = (inProps: ToolbarProps) => {
    const {
        children,
        hideTopBar = false,
        elevation = 1,
        slotProps,
        scopeIndicator,
        stackBreadcrumbsProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminToolbar" });
    const { headerHeight } = useContext(MasterLayoutContext);

    const ownerState: OwnerState = {
        headerHeight: inProps.headerHeight ?? headerHeight,
    };

    const isGlobal = isValidElement(scopeIndicator) && (scopeIndicator.props as any)?.global === true;

    return (
        <Root elevation={elevation} ownerState={ownerState} {...slotProps?.root} {...restProps}>
            {!hideTopBar && (
                <TopBar {...slotProps?.topBar}>
                    {Boolean(scopeIndicator) && isGlobal && <ScopeIndicator {...slotProps?.scopeIndicator}>{scopeIndicator}</ScopeIndicator>}
                    <Breadcrumbs {...slotProps?.breadcrumbs} />
                </TopBar>
            )}
            {children && (
                <BottomBar {...slotProps?.bottomBar}>
                    <MainContentContainer {...slotProps?.mainContentContainer}>{children}</MainContentContainer>
                </BottomBar>
            )}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbar: ToolbarClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbar: ToolbarProps;
    }

    interface Components {
        CometAdminToolbar?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminToolbar"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbar"];
        };
    }
}
