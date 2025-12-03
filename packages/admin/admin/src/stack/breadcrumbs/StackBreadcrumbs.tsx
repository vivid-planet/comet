import { ChevronRight } from "@comet/admin-icons";
import { css, type Typography, useTheme, useThemeProps } from "@mui/material";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { type Link } from "react-router-dom";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { useObservedWidth } from "../../utils/useObservedWidth";
import { getElementOuterWidth, useItemsToRender } from "./utils";

export type StackBreadcrumbsClassKey =
    | "root"
    | "breadcrumbs"
    | "listItem"
    | "link"
    | "disabledLink"
    | "overflowLink"
    | "separator"
    | "backButton"
    | "backButtonSeparator";

const Root = createComponentSlot("div")<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "root",
})(css`
    position: relative;
    width: 100%;
`);

const Breadcrumbs = createComponentSlot("div")<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "breadcrumbs",
})(
    ({ theme }) => css`
        display: flex;
        height: 50px;

        box-sizing: border-box;
        flex-wrap: nowrap;
        overflow-x: auto; // Make the breadcrumbs scrollable, if they still take up too much space, when only the first, last & the overflow link are visible.
    `,
);

const ListItem = createComponentSlot("div")<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "listItem",
})(css`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    white-space: nowrap;
`);

const Separator = createComponentSlot("div")<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "separator",
})(css`
    font-size: 14px;
    line-height: 0;
    margin-left: 8px;
    margin-right: 8px;
`);

export const BackButtonSeparator = createComponentSlot("div")<StackBreadcrumbsClassKey>({
    componentName: "StackBreadcrumbs",
    slotName: "backButtonSeparator",
})(
    ({ theme }) => css`
        height: 30px;
        width: 1px;
        background-color: ${theme.palette.divider};
        margin-right: 12px;
    `,
);

export interface StackBreadcrumbsProps
    extends ThemedComponentBaseProps<{
        root: "div";
        breadcrumbs: "div";
        listItem: "div";
        link: typeof Link;
        disabledLink: typeof Typography;
        overflowLink: typeof Link;
        separator: "div";
        backButton: typeof Link;
        backButtonSeparator: "div";
    }> {
    separator?: ReactNode;
    overflowLinkText?: ReactNode;
    showBackButton?: boolean;
}

export const StackBreadcrumbs: React.FC<StackBreadcrumbsProps> = (inProps: StackBreadcrumbsProps) => {
    const {
        separator,
        overflowLinkText = ". . .",
        showBackButton = false,
        slotProps,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminStackBreadcrumbs",
    });
    // Testdaten für Breadcrumbs (angepasst an BreadcrumbItem)
    const breadcrumbItems = [
        { id: "1", title: "Home", url: "/", parentId: "" },
        { id: "2", title: "Produkte", url: "/produkte", parentId: "1" },
        { id: "3", title: "Elektronik", url: "/produkte/elektronik", parentId: "2" },
        { id: "4", title: "Laptops", url: "/produkte/elektronik/laptops", parentId: "3" },
        { id: "5", title: "Gaming", url: "/produkte/elektronik/laptops/gaming", parentId: "4" },
        { id: "6", title: "High-End", url: "/produkte/elektronik/laptops/gaming/high-end", parentId: "5" },
        { id: "7", title: "2025", url: "/produkte/elektronik/laptops/gaming/high-end/2025", parentId: "6" },
        { id: "8", title: "Ultra", url: "/produkte/elektronik/laptops/gaming/high-end/2025/ultra", parentId: "7" },
        { id: "9", title: "Special Edition", url: "/produkte/elektronik/laptops/gaming/high-end/2025/ultra/special", parentId: "8" },
        { id: "10", title: "Collector's", url: "/produkte/elektronik/laptops/gaming/high-end/2025/ultra/special/collectors", parentId: "9" },
        {
            id: "11",
            title: "Anniversary",
            url: "/produkte/elektronik/laptops/gaming/high-end/2025/ultra/special/collectors/anniversary",
            parentId: "10",
        },
        {
            id: "12",
            title: "Limited",
            url: "/produkte/elektronik/laptops/gaming/high-end/2025/ultra/special/collectors/anniversary/limited",
            parentId: "11",
        },
        {
            id: "13",
            title: "Gold",
            url: "/produkte/elektronik/laptops/gaming/high-end/2025/ultra/special/collectors/anniversary/limited/gold",
            parentId: "12",
        },
        {
            id: "14",
            title: "Platinum",
            url: "/produkte/elektronik/laptops/gaming/high-end/2025/ultra/special/collectors/anniversary/limited/gold/platinum",
            parentId: "13",
        },
        {
            id: "15",
            title: "Diamond",
            url: "/produkte/elektronik/laptops/gaming/high-end/2025/ultra/special/collectors/anniversary/limited/gold/platinum/diamond",
            parentId: "14",
        },
    ];

    // Breadcrumbs aus Stack-API oder Testdaten
    // const stackApi = useStackApi();

    const { palette } = useTheme();
    const breadcrumbsRef = useRef<HTMLDivElement>(null);
    const containerWidth = useObservedWidth(breadcrumbsRef);
    const [itemWidths, setItemWidths] = useState<number[] | undefined>();

    // const breadcrumbItems = stackApi?.breadCrumbs ?? [];
    const combinedTitlesOfBreadcrumbs = breadcrumbItems.map(({ title }) => title).join("");

    useEffect(() => {
        setItemWidths(undefined);
    }, [breadcrumbItems?.length, combinedTitlesOfBreadcrumbs]);

    useEffect(() => {
        if (breadcrumbItems?.length && !itemWidths?.length) {
            const listItems = breadcrumbsRef.current?.children;
            const newItemWidths = listItems ? Object.values(listItems).map((listItem) => getElementOuterWidth(listItem)) : [];
            setItemWidths(newItemWidths);
        }
    }, [breadcrumbItems?.length, combinedTitlesOfBreadcrumbs, itemWidths]);

    const backButtonUrl = showBackButton && breadcrumbItems.length > 1 ? breadcrumbItems[breadcrumbItems.length - 2].url : undefined;
    const itemsToRender = useItemsToRender(breadcrumbItems, containerWidth ?? 0, itemWidths, overflowLinkText, backButtonUrl, slotProps);

    if (!breadcrumbItems.length) return null;

    return (
        <Root {...slotProps?.root} {...restProps}>
            <Breadcrumbs {...slotProps?.breadcrumbs} ref={breadcrumbsRef}>
                {itemsToRender.map((item, index) => (
                    <ListItem {...slotProps?.listItem} key={index}>
                        {item}
                        {index < itemsToRender.length - 1 && (
                            <Separator {...slotProps?.separator}>
                                {separator ?? <ChevronRight fontSize="inherit" htmlColor={palette.grey[900]} />}
                            </Separator>
                        )}
                    </ListItem>
                ))}
            </Breadcrumbs>
        </Root>
    );
};
