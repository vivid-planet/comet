import { ChevronRight } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { type ReactNode, type Ref, useRef, useState } from "react";

import type { Breadcrumb, BreadcrumbsProps, BreadcrumbsSlotProps } from "./Breadcrumbs";
import {
    ActiveItem,
    Ellipsis,
    ellipsisLabel,
    EllipsisMeasureLayer,
    Item,
    MenuContainer,
    OverflowButton,
    OverflowMenu,
    OverflowMenuItem,
    Root,
    Separator,
    ToolbarContainer,
} from "./Breadcrumbs.slots";
import { useBreadcrumbsOverflow } from "./useBreadcrumbsOverflow";

interface DesktopBreadcrumbsProps extends Omit<BreadcrumbsProps, "iconMapping"> {
    separatorIcon: ReactNode;
}

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

export const DesktopBreadcrumbs = ({ items, separatorIcon, slotProps, ...restProps }: DesktopBreadcrumbsProps) => {
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
