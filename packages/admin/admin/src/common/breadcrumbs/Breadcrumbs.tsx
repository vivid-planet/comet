import { ChevronDown, ChevronRight, ChevronUp } from "@comet/admin-icons";
import { type ButtonBase, type ComponentsOverrides, type Popover as MuiPopover, Typography, useMediaQuery } from "@mui/material";
import { type Theme, useThemeProps } from "@mui/material/styles";
import { type ReactNode, type Ref, useRef, useState } from "react";

import type { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import {
    ActiveItem,
    type BreadcrumbsClassKey,
    Ellipsis,
    EllipsisMeasureLayer,
    ExpandedMenu,
    ExpandedMenuActiveItem,
    ExpandedMenuActiveItemWrapper,
    ExpandedMenuItem,
    ExpandedMenuSubitemWrapper,
    Item,
    MenuContainer,
    MobileMenuIcon,
    MobileRootButton,
    OverflowButton,
    OverflowMenu,
    OverflowMenuItem,
    PageTreeVerticalLine,
    Root,
    Separator,
    ToolbarContainer,
} from "./Breadcrumbs.styles";
import { useBreadcrumbsOverflow } from "./useBreadcrumbsOverflow";

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
    }> {
    items: Breadcrumb[];
    iconMapping?: { separator?: ReactNode; openMenu?: ReactNode; closeMenu?: ReactNode };
}

type BreadcrumbsSlotProps = BreadcrumbsProps["slotProps"];

const ellipsisLabel = ". . .";

const BreadcrumbItemLink = ({ item, separatorIcon, slotProps }: { item: Breadcrumb; separatorIcon: ReactNode; slotProps?: BreadcrumbsSlotProps }) => (
    <MenuContainer ownerState={{ isCurrentItem: false }} {...slotProps?.menuContainer}>
        {/* @ts-expect-error The component prop does not work properly with MUIs `styled()`, see: https://mui.com/material-ui/guides/typescript/#complications-with-the-component-prop */}
        <Item component="a" href={item.url} {...slotProps?.item}>
            {item.title}
        </Item>
        <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
    </MenuContainer>
);

const CurrentBreadcrumbItem = ({ item, slotProps }: { item: Breadcrumb; slotProps?: BreadcrumbsSlotProps }) => (
    <MenuContainer ownerState={{ isCurrentItem: true }} {...slotProps?.menuContainer}>
        <ActiveItem {...slotProps?.activeItem}>{item.title}</ActiveItem>
    </MenuContainer>
);

const OverflowEllipsis = ({
    separatorIcon,
    slotProps,
    onClick,
    buttonRef,
}: {
    separatorIcon: ReactNode;
    slotProps?: BreadcrumbsSlotProps;
    onClick?: () => void;
    buttonRef?: Ref<HTMLButtonElement>;
}) => (
    <MenuContainer ownerState={{ isCurrentItem: false }} {...slotProps?.menuContainer}>
        <OverflowButton ref={buttonRef} onClick={onClick} {...slotProps?.overflowButton}>
            <Ellipsis {...slotProps?.ellipsis}>{ellipsisLabel}</Ellipsis>
        </OverflowButton>
        <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
    </MenuContainer>
);

const ExpandedMenuEntry = ({
    item,
    indentation,
    isCurrentItem,
    slotProps,
}: {
    item: Breadcrumb;
    indentation: number;
    isCurrentItem: boolean;
    slotProps?: BreadcrumbsSlotProps;
}) => {
    const Wrapper = isCurrentItem ? ExpandedMenuActiveItemWrapper : ExpandedMenuSubitemWrapper;
    const wrapperSlotProps = isCurrentItem ? slotProps?.expandedMenuActiveItemWrapper : slotProps?.expandedMenuSubitemWrapper;

    return (
        <Wrapper ownerState={{ indentation }} {...wrapperSlotProps}>
            {indentation > 0 && <PageTreeVerticalLine {...slotProps?.pageTreeVerticalLine} />}
            {isCurrentItem ? (
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
};

interface DesktopBreadcrumbsProps extends Omit<BreadcrumbsProps, "iconMapping"> {
    separatorIcon: ReactNode;
}

const DesktopBreadcrumbs = ({ items, separatorIcon, slotProps, ...restProps }: DesktopBreadcrumbsProps) => {
    const [isOverflowMenuOpen, setIsOverflowMenuOpen] = useState(false);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const ellipsisMeasureRef = useRef<HTMLDivElement>(null);
    const overflowButtonRef = useRef<HTMLButtonElement>(null);

    const { isMeasuring, numberOfHiddenItems } = useBreadcrumbsOverflow({ items, itemsRef: toolbarRef, ellipsisRef: ellipsisMeasureRef });
    const hasHiddenItems = !isMeasuring && numberOfHiddenItems > 0;
    const hiddenItems = hasHiddenItems ? items.slice(1, 1 + numberOfHiddenItems) : [];

    // While measuring, all items are rendered so that `useBreadcrumbsOverflow` can determine their widths.
    const itemsAfterFirst = items.slice(1);
    const visibleTrailingItems = isMeasuring ? itemsAfterFirst : itemsAfterFirst.slice(numberOfHiddenItems);

    return (
        <Root {...slotProps?.root} {...restProps}>
            <ToolbarContainer ref={toolbarRef} {...slotProps?.toolbarContainer}>
                {items.length <= 1 ? (
                    items.map((item) => <CurrentBreadcrumbItem key={item.url} item={item} slotProps={slotProps} />)
                ) : (
                    <>
                        <BreadcrumbItemLink item={items[0]} separatorIcon={separatorIcon} slotProps={slotProps} />
                        {hasHiddenItems && (
                            <OverflowEllipsis
                                separatorIcon={separatorIcon}
                                slotProps={slotProps}
                                onClick={() => setIsOverflowMenuOpen((prev) => !prev)}
                                buttonRef={overflowButtonRef}
                            />
                        )}
                        {visibleTrailingItems.map((item, index) =>
                            index === visibleTrailingItems.length - 1 ? (
                                <CurrentBreadcrumbItem key={item.url} item={item} slotProps={slotProps} />
                            ) : (
                                <BreadcrumbItemLink key={item.url} item={item} separatorIcon={separatorIcon} slotProps={slotProps} />
                            ),
                        )}
                    </>
                )}
            </ToolbarContainer>

            <EllipsisMeasureLayer ref={ellipsisMeasureRef} aria-hidden>
                <OverflowEllipsis separatorIcon={separatorIcon} slotProps={slotProps} />
            </EllipsisMeasureLayer>

            <OverflowMenu
                open={isOverflowMenuOpen && hiddenItems.length > 0}
                anchorEl={overflowButtonRef.current}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                marginThreshold={0}
                onClose={() => setIsOverflowMenuOpen(false)}
                {...slotProps?.overflowMenu}
            >
                {hiddenItems.map((item) => (
                    <OverflowMenuItem key={item.url} href={item.url} {...slotProps?.overflowMenuItem}>
                        <ChevronRight />
                        <Typography variant="body2">{item.title}</Typography>
                    </OverflowMenuItem>
                ))}
            </OverflowMenu>
        </Root>
    );
};

interface MobileBreadcrumbsProps extends Omit<BreadcrumbsProps, "iconMapping"> {
    separatorIcon: ReactNode;
    openMenuIcon: ReactNode;
    closeMenuIcon: ReactNode;
}

const MobileBreadcrumbs = ({ items, separatorIcon, openMenuIcon, closeMenuIcon, slotProps, ...restProps }: MobileBreadcrumbsProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const currentItem = items[items.length - 1];

    return (
        <MobileRootButton onClick={() => setIsMenuOpen((prev) => !prev)} {...slotProps?.mobileRootButton}>
            <Root {...slotProps?.root} {...restProps}>
                <ToolbarContainer {...slotProps?.toolbarContainer}>
                    {items.length > 1 && (
                        <>
                            <Ellipsis {...slotProps?.ellipsis}>{ellipsisLabel}</Ellipsis>
                            <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
                        </>
                    )}
                    <ActiveItem {...slotProps?.activeItem}>{currentItem.title}</ActiveItem>
                </ToolbarContainer>

                {isMenuOpen && (
                    <ExpandedMenu {...slotProps?.expandedMenu}>
                        {items.map((item, index) => (
                            <ExpandedMenuEntry
                                key={item.url}
                                item={item}
                                indentation={index}
                                isCurrentItem={index === items.length - 1}
                                slotProps={slotProps}
                            />
                        ))}
                    </ExpandedMenu>
                )}

                <MobileMenuIcon {...slotProps?.mobileMenuIcon}>{isMenuOpen ? closeMenuIcon : openMenuIcon}</MobileMenuIcon>
            </Root>
        </MobileRootButton>
    );
};

export const Breadcrumbs = (inProps: BreadcrumbsProps) => {
    const { iconMapping = {}, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminBreadcrumbs" });
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const {
        separator: separatorIcon = <ChevronRight />,
        openMenu: openMenuIcon = <ChevronDown />,
        closeMenu: closeMenuIcon = <ChevronUp />,
    } = iconMapping;

    if (isMobile) {
        return <MobileBreadcrumbs separatorIcon={separatorIcon} openMenuIcon={openMenuIcon} closeMenuIcon={closeMenuIcon} {...restProps} />;
    }

    return <DesktopBreadcrumbs separatorIcon={separatorIcon} {...restProps} />;
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
