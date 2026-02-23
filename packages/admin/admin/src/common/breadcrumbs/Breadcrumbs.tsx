/* eslint-disable react/jsx-no-literals */
import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { type ComponentsOverrides, Typography, useMediaQuery } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { type ReactNode, useState } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

type BreadcrumbsClassKey =
    | "root"
    | "item"
    | "separator"
    | "ellipsis"
    | "menuContainer"
    | "toolbarContainer"
    | "expandedMenu"
    | "expandedMenuItem"
    | "pageTreeVerticalLine"
    | "expandedMenuSubItemWrapper";

export interface Breadcrumb {
    url: string;
    title: ReactNode;
}

interface BreadcrumbsProps
    extends ThemedComponentBaseProps<{
        root: "div";
        item: typeof Typography;
        separator: typeof ChevronRight;
        ellipsis: "span";
        menuContainer: "div";
        toolbarContainer: "div";
        expandedMenu: "div";
        expandedMenuItem: typeof Typography;
        pageTreeVerticalLine: "div";
        expandedMenuSubItemWrapper: "div";
    }> {
    items: Breadcrumb[];
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
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `,
) as typeof Typography;

const Separator = createComponentSlot(ChevronRight)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "separator",
})(css`
    margin: 0 5px;
`);

const Ellipsis = createComponentSlot("span")<BreadcrumbsClassKey>({
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
            display: block;
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
        box-shadow: ${theme.shadows[2]};
        padding: ${theme.spacing(4)};
        z-index: 1000;
        display: flex;
        flex-direction: column;
    `,
);

const ExpandedMenuItem = createComponentSlot(Typography)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenuItem",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        white-space: nowrap;
        padding-top: 12.5px;
        padding-bottom: 12.5px;

        &:hover {
            color: ${theme.palette.primary.main};
        }
    `,
) as typeof Typography;

const ExpandedMenuSubItemWrapper = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenuSubItemWrapper",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: 5px;
        height: 45px;
        align-self: flex-start;
    `,
);

const PageTreeVerticalLine = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "pageTreeVerticalLine",
})(
    ({ theme }) => css`
        width: 4px;
        height: 22.5px;
        border-left: 2px solid ${theme.palette.grey[100]};
        border-bottom: 2px solid ${theme.palette.grey[100]};
        align-self: flex-start;
    `,
);

export const Breadcrumbs = (inProps: BreadcrumbsProps) => {
    const { items, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminBreadcrumbs" });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <Root {...slotProps?.root} {...restProps}>
            <ToolbarContainer>
                {items.map((item, index) => {
                    const isCurrentPage = index === items.length - 1;
                    const hasMultipleItems = items.length > 1;

                    if (isCurrentPage) {
                        return (
                            <>
                                {hasMultipleItems && isMobile && (
                                    <>
                                        <Ellipsis {...slotProps?.ellipsis} onClick={toggleMenu}>
                                            . . .
                                        </Ellipsis>
                                        <Separator {...slotProps?.separator} />
                                    </>
                                )}

                                <Item key={item.url} {...slotProps?.item}>
                                    {item.title}
                                </Item>
                            </>
                        );
                    }

                    return (
                        <MenuContainer key={item.url}>
                            {/* @ts-expect-error The component prop does not work properly with MUIs `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop */}
                            <Item component="a" href={item.url} {...slotProps?.item}>
                                {item.title}
                            </Item>
                            <Separator {...slotProps?.separator} />
                        </MenuContainer>
                    );
                })}
                {isMenuOpen && isMobile && (
                    <ExpandedMenu {...slotProps?.expandedMenu}>
                        {items.map((item, index) => {
                            const isCurrentPage = index === items.length - 1;

                            return !isCurrentPage ? (
                                <ExpandedMenuSubItemWrapper style={{ paddingLeft: `${index * 20}px` }}>
                                    {index > 0 && <PageTreeVerticalLine />}
                                    <ExpandedMenuItem key={item.url} {...slotProps?.expandedMenuItem}>
                                        {item.title}
                                    </ExpandedMenuItem>
                                </ExpandedMenuSubItemWrapper>
                            ) : (
                                <ExpandedMenuSubItemWrapper style={{ paddingLeft: `${index * 20}px` }}>
                                    {index > 0 && <PageTreeVerticalLine />}
                                    <ExpandedMenuItem key={item.url} {...slotProps?.expandedMenuItem}>
                                        {item.title}
                                    </ExpandedMenuItem>
                                </ExpandedMenuSubItemWrapper>
                            );
                        })}
                    </ExpandedMenu>
                )}
            </ToolbarContainer>

            {isMobile && (isMenuOpen ? <ChevronUp onClick={toggleMenu} /> : <ChevronDown onClick={toggleMenu} />)}
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
