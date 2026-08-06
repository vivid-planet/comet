import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { type ButtonBase, type ComponentsOverrides, type Popover as MuiPopover, type Typography, useMediaQuery } from "@mui/material";
import { type Theme, useThemeProps } from "@mui/material/styles";
import type { ElementType, ReactNode } from "react";

import type { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { type BreadcrumbsClassKey, ellipsisLabel } from "./Breadcrumbs.slots";
import { DesktopBreadcrumbs } from "./DesktopBreadcrumbs";
import { MobileBreadcrumbs } from "./MobileBreadcrumbs";

export type { BreadcrumbsClassKey } from "./Breadcrumbs.slots";

export interface Breadcrumb {
    url: string;
    title: ReactNode;
}

export type BreadcrumbsSlotsMap = {
    root: "div";
    startAdornment: "div";
    item: typeof Typography;
    activeItem: typeof Typography;
    separator: "div";
    ellipsis: typeof Typography;
    overflowButton: typeof ButtonBase;
    overflowMenu: typeof MuiPopover;
    overflowMenuItem: "a";
    menuContainer: "div";
    toolbarContainer: "div";
    expandedMenu: "div";
    expandedMenuItem: typeof Typography;
    expandedMenuActiveItem: typeof Typography;
    expandedMenuActiveItemWrapper: "div";
    pageTreeVerticalLine: "div";
    expandedMenuSubitemWrapper: "div";
    mobileMenuIcon: "div";
    mobileRootButton: typeof ButtonBase;
};

export interface BreadcrumbsProps extends ThemedComponentBaseProps<BreadcrumbsSlotsMap> {
    items: Breadcrumb[];
    iconMapping?: { separator?: ReactNode; openMenu?: ReactNode; closeMenu?: ReactNode };
    /**
     * Component used to render the navigable breadcrumb links (trail items, overflow menu and mobile menu entries).
     * Defaults to a plain anchor. Pass a router-aware component (e.g. one that maps `href` to react-router's `to`) for SPA navigation.
     */
    linkComponent?: ElementType;
    /**
     * Rendered before the breadcrumb trail, e.g. a back button or scope indicator. On mobile it is placed outside the menu-toggle button.
     */
    startAdornment?: ReactNode;
    /**
     * Label of the overflow ellipsis (desktop overflow button and mobile ellipsis). Defaults to `". . ."`.
     */
    overflowLabel?: ReactNode;
}

export type BreadcrumbsSlotProps = BreadcrumbsProps["slotProps"];

export const Breadcrumbs = (inProps: BreadcrumbsProps) => {
    const {
        iconMapping = {},
        linkComponent = "a",
        overflowLabel = ellipsisLabel,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminBreadcrumbs" });
    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

    const {
        separator: separatorIcon = <ChevronRight />,
        openMenu: openMenuIcon = <ChevronDown />,
        closeMenu: closeMenuIcon = <ChevronUp />,
    } = iconMapping;

    if (isDesktop) {
        return <DesktopBreadcrumbs separatorIcon={separatorIcon} linkComponent={linkComponent} overflowLabel={overflowLabel} {...restProps} />;
    }

    return (
        <MobileBreadcrumbs
            separatorIcon={separatorIcon}
            openMenuIcon={openMenuIcon}
            closeMenuIcon={closeMenuIcon}
            linkComponent={linkComponent}
            overflowLabel={overflowLabel}
            {...restProps}
        />
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminBreadcrumbs: BreadcrumbsProps;
    }

    interface ComponentNameToClassKey {
        CometAdminBreadcrumbs: BreadcrumbsClassKey;
    }

    interface Components {
        CometAdminBreadcrumbs?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminBreadcrumbs"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminBreadcrumbs"];
        };
    }
}
