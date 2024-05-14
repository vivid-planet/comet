import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { ButtonBase, ComponentsOverrides, css, ListItemText, Menu, MenuItem, Theme, Typography, useThemeProps } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useStackApi } from "../../stack/Api";
import { useObservedWidth } from "../../utils/useObservedWidth";

// TODO: Remove debug code when we have stories for the new Toolbar to simulate a large stack
const __DEBUG__numberOfPages = 6;
const __DEBUG__dummyStackPages = [
    { title: "Lorem ipsum", url: "/lorem-ipsum" },
    { title: "Foo Bar", url: "/foo-bar" },
    { title: "Nested page", url: "/nested-page" },
    { title: "Another page", url: "/another-page" },
    { title: "More nested pages", url: "/more-nested-pages" },
    { title: "And even more nested pages", url: "/and-even-more-nested-pages" },
    { title: "Foo", url: "/foo" },
    { title: "Lorem", url: "/lorem" },
    { title: "More pages", url: "/more-pages" },
];
const __DEBUG__usedNumberOfStackPages = __DEBUG__dummyStackPages.slice(0, __DEBUG__numberOfPages);
const __DEBUG__useDebugBreadcrumbData = false;

type ToolbarBreadcrumbsClassKey =
    | "root"
    | "scopeIndicator"
    | "breadcrumbsList"
    | "mobileBreadcrumbsButton"
    | "currentBreadcrumbsItem"
    | "breadcrumbsItem"
    | "breadcrumbsItemSeparator"
    | "breadcrumbsEllipsisItem"
    | "mobileMenu"
    | "mobileMenuIcon"
    | "mobileMenuItem"
    | "mobileMenuItemText"
    | "mobileMenuItemNestingIndicator";

interface ToolbarBreadcrumbsProps
    extends ThemedComponentBaseProps<{
        root: "div";
        scopeIndicator: "div";
        breadcrumbsList: "div";
        mobileBreadcrumbsButton: typeof ButtonBase;
        currentBreadcrumbsItem: typeof Typography;
        breadcrumbsItem: typeof Typography;
        breadcrumbsItemSeparator: "div";
        breadcrumbsEllipsisItem: typeof Typography;
        mobileMenu: typeof Menu;
        mobileMenuIcon: "div";
        mobileMenuItem: typeof MenuItem;
        mobileMenuItemText: typeof ListItemText;
        mobileMenuItemNestingIndicator: "div";
    }> {
    scopeIndicator?: React.ReactNode;
    iconMapping?: {
        itemSeparator?: React.ReactNode;
        openMobileMenu?: React.ReactNode;
        closeMobileMenu?: React.ReactNode;
    };
}

export const ToolbarBreadcrumbs = (inProps: ToolbarBreadcrumbsProps) => {
    const { scopeIndicator, iconMapping = {}, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminToolbarBreadcrumbs" });
    const {
        itemSeparator: itemSeparatorIcon = <ChevronRight />,
        openMobileMenu: openMobileMenuIcon = <ChevronDown />,
        closeMobileMenu: closeMobileMenuIcon = <ChevronUp />,
    } = iconMapping;
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const stackApi = useStackApi();

    const breadcrumbs = __DEBUG__useDebugBreadcrumbData ? __DEBUG__usedNumberOfStackPages : stackApi?.breadCrumbs ?? [];
    const menuWidth = useObservedWidth(rootRef);

    if (!breadcrumbs.length) {
        return null;
    }

    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

    const toggleMobileMenu = () => {
        setShowMobileMenu((val) => !val);
    };

    const itemSeparator = <BreadcrumbsItemSeparator>{itemSeparatorIcon}</BreadcrumbsItemSeparator>;

    return (
        <>
            <Root ref={rootRef} {...slotProps?.root} {...restProps}>
                {Boolean(scopeIndicator) && <ScopeIndicator {...slotProps?.scopeIndicator}>{scopeIndicator}</ScopeIndicator>}
                <BreadcrumbsList {...slotProps?.breadcrumbsList}>
                    {breadcrumbs.map(({ title, url }, index) => {
                        const isCurrentPage = index === breadcrumbs.length - 1;

                        const commonItemProps = {
                            variant: "body2",
                            title: typeof title === "string" ? title : undefined,
                        } as const;

                        return (
                            <React.Fragment key={index}>
                                {isCurrentPage ? (
                                    <CurrentBreadcrumbsItem {...commonItemProps} {...slotProps?.currentBreadcrumbsItem}>
                                        {title}
                                    </CurrentBreadcrumbsItem>
                                ) : (
                                    <>
                                        <BreadcrumbsItem
                                            {...commonItemProps}
                                            {...slotProps?.breadcrumbsItem}
                                            // @ts-expect-error The component prop does not work properly with MUIs `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop
                                            component={RouterLink}
                                            to={url}
                                        >
                                            {title}
                                        </BreadcrumbsItem>
                                        {itemSeparator}
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbsList>
                <MobileBreadcrumbsButton disableRipple {...slotProps?.mobileBreadcrumbsButton} onClick={toggleMobileMenu}>
                    {breadcrumbs.length > 1 && (
                        <>
                            <BreadcrumbsEllipsisItem variant="body2" {...slotProps?.breadcrumbsEllipsisItem}>
                                ...
                            </BreadcrumbsEllipsisItem>
                            {itemSeparator}
                        </>
                    )}
                    <CurrentBreadcrumbsItem variant="body2" {...slotProps?.currentBreadcrumbsItem}>
                        {lastBreadcrumb.title}
                    </CurrentBreadcrumbsItem>
                    <MobileMenuIcon {...slotProps?.mobileMenuIcon}>{showMobileMenu ? closeMobileMenuIcon : openMobileMenuIcon}</MobileMenuIcon>
                </MobileBreadcrumbsButton>
            </Root>
            <MobileMenu
                open={showMobileMenu}
                anchorEl={rootRef.current}
                onClose={toggleMobileMenu}
                {...slotProps?.mobileMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                    ...slotProps?.mobileMenu?.anchorOrigin,
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                    ...slotProps?.mobileMenu?.transformOrigin,
                }}
                MenuListProps={{
                    // @ts-expect-error This works but the `component` prop seems to be missing in the type definitions
                    component: "div",
                    ...slotProps?.mobileMenu?.MenuListProps,
                }}
                PaperProps={{
                    ...slotProps?.mobileMenu?.PaperProps,
                    sx: {
                        width: menuWidth,
                        ...slotProps?.mobileMenu?.PaperProps?.sx,
                    },
                }}
            >
                {breadcrumbs.map(({ title, url }, nestingLevel) => {
                    const isCurrentPage = nestingLevel === breadcrumbs.length - 1;

                    return (
                        <MobileMenuItem
                            {...slotProps?.mobileMenuItem}
                            key={nestingLevel}
                            onClick={toggleMobileMenu}
                            selected={isCurrentPage}
                            // @ts-expect-error The component prop does not work properly with MUIs `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop
                            component={RouterLink}
                            to={url}
                        >
                            {nestingLevel > 0 && (
                                <MobileMenuItemNestingIndicator {...slotProps?.mobileMenuItemNestingIndicator} ownerState={{ nestingLevel }} />
                            )}
                            <MobileMenuItemText {...slotProps?.mobileMenuItemText} primary={title} ownerState={{ isCurrentPage }} />
                        </MobileMenuItem>
                    );
                })}
            </MobileMenu>
        </>
    );
};

const Root = createComponentSlot("div")<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "root",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
        padding-left: ${theme.spacing(2)};
        padding-right: ${theme.spacing(2)};
    `,
);

const ScopeIndicator = createComponentSlot("div")<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "scopeIndicator",
})();

const BreadcrumbsList = createComponentSlot("div")<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "breadcrumbsList",
})(
    ({ theme }) => css`
        display: none;
        align-items: center;
        gap: ${theme.spacing(1)};
        overflow: hidden;

        ${theme.breakpoints.up("md")} {
            display: flex;
        }
    `,
);

const MobileBreadcrumbsButton = createComponentSlot(ButtonBase)<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "mobileBreadcrumbsButton",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        flex-grow: 1;
        overflow: hidden;
        padding-top: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};

        ${theme.breakpoints.up("md")} {
            display: none;
        }
    `,
);

const getCommonItemStyles = (theme: Theme) => css`
    color: ${theme.palette.grey[900]};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    ${theme.breakpoints.up("md")} {
        padding-top: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};
    }
`;

const CurrentBreadcrumbsItem = createComponentSlot(Typography)<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "currentBreadcrumbsItem",
})(
    ({ theme }) => css`
        ${getCommonItemStyles(theme)}
        font-weight: 600;
    `,
) as typeof Typography;

const BreadcrumbsItem = createComponentSlot(Typography)<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "breadcrumbsItem",
})(
    ({ theme }) => css`
        ${getCommonItemStyles(theme)}

        ${theme.breakpoints.up("md")} {
            display: block;
        }
    `,
);

const BreadcrumbsItemSeparator = createComponentSlot("div")<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "breadcrumbsItemSeparator",
})(
    ({ theme }) => css`
        line-height: 0;
        display: none;

        :nth-last-of-type(2) {
            display: block;
        }

        ${theme.breakpoints.up("md")} {
            display: block;
        }
    `,
);

const BreadcrumbsEllipsisItem = createComponentSlot(Typography)<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "breadcrumbsEllipsisItem",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        text-decoration: underline;
        padding: ${theme.spacing(1)};
        margin-left: ${theme.spacing(-1)};
        margin-right: ${theme.spacing(-1)};
        cursor: pointer;

        ${theme.breakpoints.up("md")} {
            display: none;
        }
    `,
);

const MobileMenu = createComponentSlot(Menu)<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "mobileMenu",
})(
    ({ theme }) => css`
        .MuiMenu-list {
            padding-top: ${theme.spacing(3)};
            padding-bottom: ${theme.spacing(3)};
        }
    `,
);

const MobileMenuIcon = createComponentSlot("div")<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "mobileMenuIcon",
})(css`
    margin-left: auto;
    line-height: 0;
`);

const MobileMenuItem = createComponentSlot(MenuItem)<ToolbarBreadcrumbsClassKey>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "mobileMenuItem",
})(
    ({ theme }) => css`
        position: relative;
        min-height: auto;
        padding-left: ${theme.spacing(3)};
        padding-right: ${theme.spacing(3)};
        padding-top: 8px;
        padding-bottom: 8px;

        :hover,
        &.Mui-selected,
        &.Mui-focusVisible,
        &.Mui-selected.Mui-focusVisible,
        &.Mui-selected:hover {
            background-color: ${theme.palette.grey[50]};
        }
    `,
);

const MobileMenuItemText = createComponentSlot(ListItemText)<ToolbarBreadcrumbsClassKey, { isCurrentPage: boolean }>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "mobileMenuItemText",
})(
    ({ ownerState }) => css`
        .MuiListItemText-primary {
            font-weight: ${ownerState.isCurrentPage ? 600 : 300};
            text-overflow: ellipsis;
            overflow: hidden;
        }
    `,
);

const MobileMenuItemNestingIndicator = createComponentSlot("div")<ToolbarBreadcrumbsClassKey, { nestingLevel: number }>({
    componentName: "ToolbarBreadcrumbs",
    slotName: "mobileMenuItemNestingIndicator",
})(
    ({ theme, ownerState }) => css`
        position: relative;
        margin-left: ${17 * ownerState.nestingLevel}px;
        width: 12px;
        flex-shrink: 0;

        :before {
            content: "";
            position: absolute;
            top: -18px;
            left: 0;
            width: 5px;
            height: 15px;
            border-width: 0 0 1px 1px;
            border-style: solid;
            border-color: ${theme.palette.grey[100]};
            box-sizing: border-box;
        }
    `,
);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarBreadcrumbs: ToolbarBreadcrumbsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbarBreadcrumbs: ToolbarBreadcrumbsProps;
    }

    interface Components {
        CometAdminToolbarBreadcrumbs?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminToolbarBreadcrumbs"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarBreadcrumbs"];
        };
    }
}
