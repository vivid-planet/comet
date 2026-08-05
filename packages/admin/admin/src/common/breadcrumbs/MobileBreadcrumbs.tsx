import { type ElementType, type ReactNode, useState } from "react";

import type { Breadcrumb, BreadcrumbsProps, BreadcrumbsSlotProps } from "./Breadcrumbs";
import {
    ActiveItem,
    Ellipsis,
    ExpandedMenu,
    ExpandedMenuActiveItem,
    ExpandedMenuActiveItemWrapper,
    ExpandedMenuItem,
    ExpandedMenuSubitemWrapper,
    MobileMenuIcon,
    MobileRootButton,
    PageTreeVerticalLine,
    Root,
    Separator,
    StartAdornment,
    ToolbarContainer,
} from "./Breadcrumbs.slots";

interface MobileBreadcrumbsProps extends Omit<BreadcrumbsProps, "iconMapping"> {
    separatorIcon: ReactNode;
    openMenuIcon: ReactNode;
    closeMenuIcon: ReactNode;
    linkComponent: ElementType;
    overflowLabel: ReactNode;
}

const ExpandedMenuEntry = ({
    item,
    indentation,
    isCurrentItem,
    linkComponent,
    onNavigate,
    slotProps,
}: {
    item: Breadcrumb;
    indentation: number;
    isCurrentItem: boolean;
    linkComponent: ElementType;
    onNavigate: () => void;
    slotProps?: BreadcrumbsSlotProps;
}) => {
    const Wrapper = isCurrentItem ? ExpandedMenuActiveItemWrapper : ExpandedMenuSubitemWrapper;
    const wrapperSlotProps = isCurrentItem ? slotProps?.expandedMenuActiveItemWrapper : slotProps?.expandedMenuSubitemWrapper;

    return (
        // @ts-expect-error The `as`/`href` props swap the div slot to the (optionally router-aware) link component, which MUIs `styled()` types don't model.
        <Wrapper as={linkComponent} href={item.url} onClick={onNavigate} ownerState={{ indentation }} {...wrapperSlotProps}>
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

export const MobileBreadcrumbs = ({
    items,
    separatorIcon,
    openMenuIcon,
    closeMenuIcon,
    linkComponent,
    overflowLabel,
    startAdornment,
    slotProps,
    ...restProps
}: MobileBreadcrumbsProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const currentItem = items[items.length - 1];

    return (
        <Root {...slotProps?.root} {...restProps}>
            {startAdornment && <StartAdornment {...slotProps?.startAdornment}>{startAdornment}</StartAdornment>}
            <MobileRootButton onClick={() => setIsMenuOpen((prev) => !prev)} {...slotProps?.mobileRootButton}>
                <ToolbarContainer {...slotProps?.toolbarContainer}>
                    {items.length > 1 && (
                        <>
                            <Ellipsis {...slotProps?.ellipsis}>{overflowLabel}</Ellipsis>
                            <Separator {...slotProps?.separator}>{separatorIcon}</Separator>
                        </>
                    )}
                    <ActiveItem {...slotProps?.activeItem}>{currentItem.title}</ActiveItem>
                </ToolbarContainer>

                <MobileMenuIcon {...slotProps?.mobileMenuIcon}>{isMenuOpen ? closeMenuIcon : openMenuIcon}</MobileMenuIcon>
            </MobileRootButton>

            {isMenuOpen && (
                <ExpandedMenu {...slotProps?.expandedMenu}>
                    {items.map((item, index) => (
                        <ExpandedMenuEntry
                            key={item.url}
                            item={item}
                            indentation={index}
                            isCurrentItem={index === items.length - 1}
                            linkComponent={linkComponent}
                            onNavigate={() => setIsMenuOpen(false)}
                            slotProps={slotProps}
                        />
                    ))}
                </ExpandedMenu>
            )}
        </Root>
    );
};
