/* eslint-disable react/jsx-no-literals */
import { ChevronRight } from "@comet/admin-icons";
import { type ComponentsOverrides, Typography } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { type ReactNode, useState } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

type BreadcrumbsClassKey = "root" | "item" | "separator" | "ellipsis" | "menuContainer" | "expandedMenu" | "expandedMenuItem";

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
        expandedMenu: "div";
        expandedMenuItem: typeof Typography;
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
        padding: ${theme.spacing(2)};
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(1)};
    `,
);

const ExpandedMenuItem = createComponentSlot(Typography)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenuItem",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};
        white-space: nowrap;

        &:hover {
            color: ${theme.palette.primary.main};
        }
    `,
) as typeof Typography;

export const Breadcrumbs = (inProps: BreadcrumbsProps) => {
    const { items, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminBreadcrumbs" });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <Root {...slotProps?.root} {...restProps}>
            {items.map((item, index) => {
                const isCurrentPage = index === items.length - 1;
                const hasMultipleItems = items.length > 1;

                if (isCurrentPage) {
                    return (
                        <>
                            {hasMultipleItems && (
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

            {isMenuOpen && (
                <ExpandedMenu {...slotProps?.expandedMenu}>
                    {items.map((item, index) => {
                        const isCurrentPage = index === items.length - 1;

                        return !isCurrentPage ? (
                            // @ts-expect-error The component prop does not work properly with MUIs `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop
                            <ExpandedMenuItem
                                key={item.url}
                                component="a"
                                href={item.url}
                                {...slotProps?.expandedMenuItem}
                                style={{ paddingLeft: `${index * 20}px` }}
                            >
                                {item.title}
                            </ExpandedMenuItem>
                        ) : (
                            <ExpandedMenuItem key={item.url} {...slotProps?.expandedMenuItem} style={{ paddingLeft: `${index * 20}px` }}>
                                {item.title}
                            </ExpandedMenuItem>
                        );
                    })}
                </ExpandedMenu>
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
