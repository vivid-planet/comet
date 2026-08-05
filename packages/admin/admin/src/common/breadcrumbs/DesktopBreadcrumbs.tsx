import { ChevronRight } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { type ElementType, type ReactNode, type Ref, useEffect, useRef, useState } from "react";

import type { Breadcrumb, BreadcrumbsProps, BreadcrumbsSlotProps } from "./Breadcrumbs";
import {
    ActiveItem,
    Ellipsis,
    Item,
    MeasureLayer,
    MenuContainer,
    OverflowButton,
    OverflowMenu,
    OverflowMenuItem,
    Root,
    Separator,
    StartAdornment,
    ToolbarContainer,
} from "./Breadcrumbs.slots";
import { useBreadcrumbsOverflow } from "./useBreadcrumbsOverflow";

interface DesktopBreadcrumbsProps extends Omit<BreadcrumbsProps, "iconMapping"> {
    separatorIcon: ReactNode;
    linkComponent: ElementType;
    overflowLabel: ReactNode;
}

const BreadcrumbItemLink = ({
    item,
    separatorIcon,
    linkComponent,
    slotProps,
}: {
    item: Breadcrumb;
    separatorIcon: ReactNode;
    linkComponent: ElementType;
    slotProps?: BreadcrumbsSlotProps;
}) => (
    <MenuContainer ownerState={{ isCurrentItem: false }} {...slotProps?.menuContainer}>
        <Item component={linkComponent} href={item.url} {...slotProps?.item}>
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
    overflowLabel,
    slotProps,
    onClick,
    buttonRef,
}: {
    separatorIcon: ReactNode;
    overflowLabel: ReactNode;
    slotProps?: BreadcrumbsSlotProps;
    onClick?: () => void;
    buttonRef?: Ref<HTMLButtonElement>;
}) => (
    <MenuContainer ownerState={{ isCurrentItem: false }} {...slotProps?.menuContainer}>
        <OverflowButton ref={buttonRef} onClick={onClick} {...slotProps?.overflowButton}>
            <Ellipsis {...slotProps?.ellipsis}>{overflowLabel}</Ellipsis>
        </OverflowButton>
        <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
    </MenuContainer>
);

export const DesktopBreadcrumbs = ({
    items,
    separatorIcon,
    linkComponent,
    overflowLabel,
    startAdornment,
    slotProps,
    ...restProps
}: DesktopBreadcrumbsProps) => {
    const [isOverflowMenuOpen, setIsOverflowMenuOpen] = useState(false);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const overflowButtonRef = useRef<HTMLButtonElement>(null);

    const { leadingItem, hiddenItems, trailingItems } = useBreadcrumbsOverflow({ items, containerRef: toolbarRef, measureRef });
    const hasHiddenItems = hiddenItems.length > 0;

    useEffect(() => {
        if (!hasHiddenItems) {
            setIsOverflowMenuOpen(false);
        }
    }, [hasHiddenItems]);

    return (
        <Root {...slotProps?.root} {...restProps}>
            {startAdornment && <StartAdornment {...slotProps?.startAdornment}>{startAdornment}</StartAdornment>}
            <ToolbarContainer ref={toolbarRef} {...slotProps?.toolbarContainer}>
                {leadingItem && (
                    <BreadcrumbItemLink item={leadingItem} separatorIcon={separatorIcon} linkComponent={linkComponent} slotProps={slotProps} />
                )}
                {hasHiddenItems && (
                    <OverflowEllipsis
                        separatorIcon={separatorIcon}
                        overflowLabel={overflowLabel}
                        slotProps={slotProps}
                        onClick={() => setIsOverflowMenuOpen((prev) => !prev)}
                        buttonRef={overflowButtonRef}
                    />
                )}
                {trailingItems.map((item, index) =>
                    index === trailingItems.length - 1 ? (
                        <CurrentBreadcrumbItem key={item.url} item={item} slotProps={slotProps} />
                    ) : (
                        <BreadcrumbItemLink
                            key={item.url}
                            item={item}
                            separatorIcon={separatorIcon}
                            linkComponent={linkComponent}
                            slotProps={slotProps}
                        />
                    ),
                )}
            </ToolbarContainer>

            <MeasureLayer ref={measureRef} aria-hidden>
                {items.map((item, index) =>
                    index === items.length - 1 ? (
                        <CurrentBreadcrumbItem key={item.url} item={item} slotProps={slotProps} />
                    ) : (
                        <BreadcrumbItemLink
                            key={item.url}
                            item={item}
                            separatorIcon={separatorIcon}
                            linkComponent={linkComponent}
                            slotProps={slotProps}
                        />
                    ),
                )}
                <OverflowEllipsis separatorIcon={separatorIcon} overflowLabel={overflowLabel} slotProps={slotProps} />
            </MeasureLayer>

            {hasHiddenItems && (
                <OverflowMenu
                    open={isOverflowMenuOpen}
                    anchorEl={overflowButtonRef.current}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    marginThreshold={0}
                    onClose={() => setIsOverflowMenuOpen(false)}
                    {...slotProps?.overflowMenu}
                >
                    {hiddenItems.map((item) => (
                        <OverflowMenuItem key={item.url} as={linkComponent} href={item.url} {...slotProps?.overflowMenuItem}>
                            <ChevronRight />
                            <Typography variant="body2">{item.title}</Typography>
                        </OverflowMenuItem>
                    ))}
                </OverflowMenu>
            )}
        </Root>
    );
};
