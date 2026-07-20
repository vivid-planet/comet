import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { ButtonBase, type ComponentsOverrides, Typography, useMediaQuery } from "@mui/material";
import { alpha, css, styled, type Theme, useThemeProps } from "@mui/material/styles";
import { Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import type { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useObservedWidth } from "../../utils/useObservedWidth";

type BreadcrumbsClassKey =
    | "root"
    | "item"
    | "activeItem"
    | "separator"
    | "ellipsis"
    | "overflowButton"
    | "menuContainer"
    | "toolbarContainer"
    | "expandedMenu"
    | "expandedMenuItem"
    | "expandedMenuActiveItem"
    | "expandedMenuActiveItemWrapper"
    | "pageTreeVerticalLine"
    | "expandedMenuSubitemWrapper"
    | "mobileMenuIcon"
    | "mobileRootButton";

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
        overflowButton: typeof ButtonBase;
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
        height: 40px;
        padding: 0 ${theme.spacing(2)};
        cursor: pointer;

        &::after {
            content: "";
            position: absolute;
            left: ${theme.spacing(2)};
            right: ${theme.spacing(2)};
            bottom: 0;
            height: 1px;
            background-color: ${theme.palette.grey[100]};
        }

        ${theme.breakpoints.up("sm")} {
            height: 50px;
            cursor: default;

            &::after {
                content: none;
            }
        }
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
        font-size: 14px;
        line-height: 16px;
        font-weight: 600;

        ${theme.breakpoints.up("sm")} {
            font-size: 16px;
            line-height: 20px;
            font-weight: bold;
        }
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
})(
    ({ theme }) => css`
        color: inherit;
        font-size: 14px;
        line-height: 16px;

        ${theme.breakpoints.up("sm")} {
            font-size: 16px;
            line-height: 20px;
        }
    `,
);

const OverflowButton = createComponentSlot(ButtonBase)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "overflowButton",
})(
    ({ theme }) => css`
        color: ${theme.palette.grey[900]};

        &:hover {
            color: ${theme.palette.primary.main};
        }
    `,
);

type MenuContainerOwnerState = { isCurrentItem: boolean };

const MenuContainer = createComponentSlot("div")<BreadcrumbsClassKey, MenuContainerOwnerState>({
    componentName: "Breadcrumbs",
    slotName: "menuContainer",
})(
    ({ ownerState }) => css`
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-shrink: ${ownerState.isCurrentItem ? 1 : 0};
        min-width: ${ownerState.isCurrentItem ? 0 : "auto"};
    `,
);

const EllipsisMeasureLayer = styled("div")`
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    height: 0;
    overflow: hidden;
    white-space: nowrap;
`;

const ToolbarContainer = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "toolbarContainer",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        padding: 0;

        ${theme.breakpoints.up("sm")} {
            flex: 1;
            min-width: 0;
            justify-content: flex-start;
            overflow: hidden;
            height: 50px;
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
        display: flex;
        flex-direction: column;
        background-color: ${theme.palette.background.paper};
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

type WrapperOwnerState = { indentation: number };

const wrapperPaddingLeft = (theme: Theme, indentation: number) =>
    indentation === 0 ? theme.spacing(3) : `calc(${theme.spacing(1)} + 17px * ${indentation})`;

const ExpandedMenuActiveItemWrapper = createComponentSlot("div")<BreadcrumbsClassKey, WrapperOwnerState>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenuActiveItemWrapper",
})(
    ({ theme, ownerState }) => css`
        display: flex;
        align-items: center;
        gap: 5px;
        height: 45px;
        padding-left: ${wrapperPaddingLeft(theme, ownerState.indentation)};
        padding-right: ${theme.spacing(3)};
        background-color: ${alpha(theme.palette.primary.main, 0.1)};
    `,
);

const ExpandedMenuSubitemWrapper = createComponentSlot("div")<BreadcrumbsClassKey, WrapperOwnerState>({
    componentName: "Breadcrumbs",
    slotName: "expandedMenuSubitemWrapper",
})(
    ({ theme, ownerState }) => css`
        display: flex;
        align-items: center;
        gap: 5px;
        height: 45px;
        padding-left: ${wrapperPaddingLeft(theme, ownerState.indentation)};
        padding-right: ${theme.spacing(3)};
    `,
);

const MobileMenuIcon = createComponentSlot("div")<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "mobileMenuIcon",
})(css`
    display: flex;
    align-items: center;
`);

const MobileRootButton = createComponentSlot(ButtonBase)<BreadcrumbsClassKey>({
    componentName: "Breadcrumbs",
    slotName: "mobileRootButton",
})(css`
    display: block;
    width: 100%;
    text-align: left;
`);

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

const getElementOuterWidth = (element: Element): number =>
    element.clientWidth + parseFloat(getComputedStyle(element).marginLeft) + parseFloat(getComputedStyle(element).marginRight);

// Determines how many items (starting after the first one) need to be collapsed into the overflow ellipsis so that
// the first item, the ellipsis and as many trailing items as possible fit into the available width. The first item
// (root) and the last item (current page) are always kept, matching the responsive behavior of `StackBreadcrumbs`.
const getNumberOfHiddenItems = ({
    itemWidths,
    ellipsisWidth,
    containerWidth,
}: {
    itemWidths: number[];
    ellipsisWidth: number;
    containerWidth: number;
}): number => {
    if (itemWidths.length <= 2) {
        return 0;
    }

    const totalWidth = itemWidths.reduce((sum, width) => sum + width, 0);
    if (totalWidth <= containerWidth) {
        return 0;
    }

    const lastIndex = itemWidths.length - 1;
    const availableWidthForTrailingItems = containerWidth - itemWidths[0] - ellipsisWidth;

    let usedWidth = itemWidths[lastIndex]; // The last item (current page) is always shown.
    let firstVisibleTrailingIndex = lastIndex;

    for (let index = lastIndex - 1; index >= 1; index--) {
        if (usedWidth + itemWidths[index] > availableWidthForTrailingItems) {
            break;
        }
        usedWidth += itemWidths[index];
        firstVisibleTrailingIndex = index;
    }

    return firstVisibleTrailingIndex - 1;
};

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

    const toolbarRef = useRef<HTMLDivElement>(null);
    const ellipsisMeasureRef = useRef<HTMLDivElement>(null);
    const containerWidth = useObservedWidth(toolbarRef);
    const [itemWidths, setItemWidths] = useState<number[] | undefined>();
    const [ellipsisWidth, setEllipsisWidth] = useState<number | undefined>();
    const itemsKey = items.map((item) => item.url).join("|");

    useEffect(() => {
        setItemWidths(undefined);
    }, [itemsKey]);

    useEffect(() => {
        if (isMobile) {
            return;
        }
        if (items.length && !itemWidths?.length) {
            const children = toolbarRef.current?.children;
            setItemWidths(children ? Array.from(children).map(getElementOuterWidth) : []);
        }
        if (ellipsisMeasureRef.current && ellipsisWidth === undefined) {
            setEllipsisWidth(getElementOuterWidth(ellipsisMeasureRef.current));
        }
    }, [isMobile, items.length, itemsKey, itemWidths, ellipsisWidth]);

    const isMeasuring = !itemWidths?.length || ellipsisWidth === undefined;
    const numberOfHiddenItems = useMemo(
        () => (isMeasuring ? 0 : getNumberOfHiddenItems({ itemWidths, ellipsisWidth, containerWidth })),
        [isMeasuring, itemWidths, ellipsisWidth, containerWidth],
    );

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const renderItemLink = (item: Breadcrumb) => (
        <MenuContainer key={item.url} ownerState={{ isCurrentItem: false }} {...slotProps?.menuContainer}>
            {/* @ts-expect-error The component prop does not work properly with MUIs `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop */}
            <Item component="a" href={item.url} {...slotProps?.item}>
                {item.title}
            </Item>
            <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
        </MenuContainer>
    );

    const renderActiveItem = (item: Breadcrumb) => (
        <MenuContainer key={item.url} ownerState={{ isCurrentItem: true }} {...slotProps?.menuContainer}>
            <ActiveItem {...slotProps?.activeItem}>{item.title}</ActiveItem>
        </MenuContainer>
    );

    const renderOverflowEllipsis = (onClick?: () => void) => (
        <MenuContainer ownerState={{ isCurrentItem: false }} {...slotProps?.menuContainer}>
            <OverflowButton onClick={onClick} {...slotProps?.overflowButton}>
                <Ellipsis {...slotProps?.ellipsis}>{ellipsis}</Ellipsis>
            </OverflowButton>
            <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
        </MenuContainer>
    );

    const renderDesktopItems = () => {
        if (items.length <= 1) {
            return items.map((item) => renderActiveItem(item));
        }

        const itemsAfterFirst = items.slice(1);
        const visibleTrailingItems = isMeasuring ? itemsAfterFirst : itemsAfterFirst.slice(numberOfHiddenItems);
        const showOverflowEllipsis = !isMeasuring && numberOfHiddenItems > 0;

        return (
            <>
                {renderItemLink(items[0])}
                {showOverflowEllipsis && renderOverflowEllipsis(toggleMenu)}
                {visibleTrailingItems.map((item, index) =>
                    index === visibleTrailingItems.length - 1 ? renderActiveItem(item) : renderItemLink(item),
                )}
            </>
        );
    };

    const renderMobileItems = () => {
        const currentItem = items[items.length - 1];

        return (
            <Fragment key={currentItem.url}>
                {items.length > 1 && (
                    <>
                        <Ellipsis {...slotProps?.ellipsis}>{ellipsis}</Ellipsis>
                        <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
                    </>
                )}
                <ActiveItem {...slotProps?.activeItem}>{currentItem.title}</ActiveItem>
            </Fragment>
        );
    };

    const content = (
        <Root {...slotProps?.root} {...restProps}>
            <ToolbarContainer ref={toolbarRef} {...slotProps?.toolbarContainer}>
                {isMobile ? renderMobileItems() : renderDesktopItems()}
            </ToolbarContainer>

            {!isMobile && (
                <EllipsisMeasureLayer ref={ellipsisMeasureRef} aria-hidden>
                    {renderOverflowEllipsis()}
                </EllipsisMeasureLayer>
            )}

            {isMenuOpen && (
                <ExpandedMenu {...slotProps?.expandedMenu}>
                    {items.map((item, index) => {
                        const isActive = index === items.length - 1;
                        const Wrapper = isActive ? ExpandedMenuActiveItemWrapper : ExpandedMenuSubitemWrapper;
                        const wrapperSlotProps = isActive ? slotProps?.expandedMenuActiveItemWrapper : slotProps?.expandedMenuSubitemWrapper;
                        return (
                            <Wrapper key={item.url} ownerState={{ indentation: index }} {...wrapperSlotProps}>
                                {index > 0 && <PageTreeVerticalLine {...slotProps?.pageTreeVerticalLine} />}
                                {isActive ? (
                                    <ExpandedMenuActiveItem variant="subtitle2" {...slotProps?.expandedMenuActiveItem}>
                                        {item.title}
                                    </ExpandedMenuActiveItem>
                                ) : (
                                    <ExpandedMenuItem variant="body2" {...slotProps?.expandedMenuItem}>
                                        {item.title}
                                    </ExpandedMenuItem>
                                )}
                            </Wrapper>
                        );
                    })}
                </ExpandedMenu>
            )}

            {isMobile && <MobileMenuIcon {...slotProps?.mobileMenuIcon}>{isMenuOpen ? closeMenuIcon : openMenuIcon}</MobileMenuIcon>}
        </Root>
    );

    if (isMobile) {
        return (
            <MobileRootButton onClick={toggleMenu} {...slotProps?.mobileRootButton}>
                {content}
            </MobileRootButton>
        );
    }

    return content;
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
