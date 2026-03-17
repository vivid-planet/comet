import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { ButtonBase, type ComponentsOverrides, IconButton, Typography, useMediaQuery } from "@mui/material";
import { alpha, css, type Theme, useThemeProps } from "@mui/material/styles";
import { Fragment, type ReactNode, useState } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

type BreadcrumbsClassKey =
    | "root"
    | "item"
    | "activeItem"
    | "separator"
    | "ellipsis"
    | "menuContainer"
    | "toolbarContainer"
    | "expandedMenu"
    | "expandedMenuItem"
    | "expandedMenuActiveItem"
    | "expandedMenuActiveItemWrapper"
    | "pageTreeVerticalLine"
    | "expandedMenuSubitemWrapper"
    | "mobileOpenMenuButton";

export interface Breadcrumb {
    url: string;
    title: ReactNode;
}

interface BreadcrumbsProps
    extends ThemedComponentBaseProps<{
        root: "div";
        item: typeof Typography;
        activeItem: typeof Typography;
        separator: "div";
        ellipsis: typeof Typography;
        menuContainer: "div";
        toolbarContainer: "div";
        expandedMenu: "div";
        expandedMenuItem: typeof Typography;
        expandedMenuActiveItem: typeof Typography;
        expandedMenuActiveItemWrapper: "div";
        pageTreeVerticalLine: "div";
        expandedMenuSubitemWrapper: "div";
        mobileOpenMenuButton: typeof IconButton;
    }> {
    items: Breadcrumb[];
    iconMapping?: { separator?: ReactNode; openMenu?: ReactNode; closeMenu?: ReactNode };
}

const Root = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "root",
})(
    ({ theme }) => css`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        padding: 0 ${theme.spacing(2)};
    `,
);

const Item = createComponentSlot(Typography)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "item",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        white-space: nowrap;

        &:not(:last-child):hover {
            color: ${theme.palette.primary.main};
        }

        &:last-child {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `,
) as typeof Typography;

const ActiveItem = createComponentSlot(Typography)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "activeItem",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `,
) as typeof Typography;

const Separator = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "separator",
})(css`
    margin: 0 5px;
    display: flex;
    align-items: flex-end;
`);

const Ellipsis = createComponentSlot(Typography)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "ellipsis",
})(css`
    margin-right: 5px;
    color: inherit;
    cursor: pointer;
`);

const MenuContainer = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "menuContainer",
})(
    ({ theme }) => css`
        display: none;

        ${theme.breakpoints.up("sm")} {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
    `,
);

const ToolbarContainer = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "toolbarContainer",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        padding: 0 ${theme.spacing(2)};
    `,
);

const ExpandedMenu = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenu",
})(
    ({ theme }) => css`
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
        background-color: ${theme.palette.background.paper};
        padding-top: ${theme.spacing(4)};
        padding-bottom: ${theme.spacing(4)};
        z-index: 1;
    `,
);

const ExpandedMenuItem = createComponentSlot(Typography)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenuItem",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
    `,
) as typeof Typography;

const ExpandedMenuActiveItem = createComponentSlot(Typography)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenuActiveItem",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
    `,
) as typeof Typography;

const ExpandedMenuActiveItemWrapper = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenuActiveItemWrapper",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: 5px;
        height: 45px;
        align-self: flex-start;
        padding-right: ${theme.spacing(4)};
        background-color: ${alpha(theme.palette.primary.main, 0.1)};
    `,
);

const ExpandedMenuSubitemWrapper = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenuSubitemWrapper",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: 5px;
        height: 45px;
        align-self: flex-start;
        padding-right: ${theme.spacing(4)};
    `,
);

const MobileOpenMenuButton = createComponentSlot(IconButton)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "mobileOpenMenuButton",
})(css``);

const PageTreeVerticalLine = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "pageTreeVerticalLine",
})(
    ({ theme }) => css`
        width: 4px;
        height: 25px;
        border-left: 1px solid ${theme.palette.grey[100]};
        border-bottom: 1px solid ${theme.palette.grey[100]};
        align-self: flex-start;
    `,
);

export const Breadcrumbs = (inProps: BreadcrumbsProps) => {
    const { iconMapping = {}, items, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminBreadcrumbs" });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const ellipsis = ". . .";

    const {
        separator: separatorIcon = <ChevronRight />,
        openMenu: openMenuIcon = <ChevronDown />,
        closeMenu: closeMenuIcon = <ChevronUp />,
    } = iconMapping;

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <Root {...slotProps?.root} {...restProps}>
            <ToolbarContainer {...slotProps?.toolbarContainer}>
                {items.map((item, index) => {
                    const isCurrentPage = index === items.length - 1;
                    const hasMultipleItems = items.length > 1;

                    if (isCurrentPage) {
                        return (
                            <Fragment key={item.url}>
                                {hasMultipleItems && isMobile && (
                                    <>
                                        <ButtonBase>
                                            <Ellipsis {...slotProps?.ellipsis} onClick={toggleMenu}>
                                                {ellipsis}
                                            </Ellipsis>
                                        </ButtonBase>
                                        <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
                                    </>
                                )}
                                <ActiveItem key={item.url} {...slotProps?.activeItem} fontWeight="bold">
                                    {item.title}
                                </ActiveItem>
                            </Fragment>
                        );
                    }

                    return (
                        <MenuContainer key={item.url} {...slotProps?.menuContainer}>
                            {/* @ts-expect-error The component prop does not work properly with MUIs `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop */}
                            <Item component="a" href={item.url} {...slotProps?.item}>
                                {item.title}
                            </Item>
                            <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
                        </MenuContainer>
                    );
                })}
                {isMenuOpen && (
                    <ExpandedMenu {...slotProps?.expandedMenu}>
                        {items.map((item, index) => {
                            const isActive = index === items.length - 1;
                            const Wrapper = isActive ? ExpandedMenuActiveItemWrapper : ExpandedMenuSubitemWrapper;
                            const wrapperSlotProps = isActive ? slotProps?.expandedMenuActiveItemWrapper : slotProps?.expandedMenuSubitemWrapper;
                            return (
                                <Wrapper key={item.url} style={{ paddingLeft: `calc(${index * 16}px + 32px)` }} {...wrapperSlotProps}>
                                    {index > 0 && <PageTreeVerticalLine {...slotProps?.pageTreeVerticalLine} />}
                                    {isActive ? (
                                        <ExpandedMenuActiveItem {...slotProps?.expandedMenuActiveItem} fontWeight="bold">
                                            {item.title}
                                        </ExpandedMenuActiveItem>
                                    ) : (
                                        <ExpandedMenuItem {...slotProps?.expandedMenuItem}>{item.title}</ExpandedMenuItem>
                                    )}
                                </Wrapper>
                            );
                        })}
                    </ExpandedMenu>
                )}
            </ToolbarContainer>

            {isMobile && (
                <MobileOpenMenuButton onClick={toggleMenu} {...slotProps?.mobileOpenMenuButton}>
                    {isMenuOpen ? closeMenuIcon : openMenuIcon}
                </MobileOpenMenuButton>
            )}
        </Root>
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
