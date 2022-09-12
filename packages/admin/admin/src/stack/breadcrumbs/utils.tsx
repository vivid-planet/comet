import { ClassKeyOfStyles, ClassNameMap } from "@mui/styles";
import * as React from "react";

import { BreadcrumbItem } from "../Stack";
import { BreadcrumbsEntry } from "./BreadcrumbsEntry";
import { BreadcrumbsOverflow } from "./BreadcrumbsOverflow";
import { styles } from "./StackBreadcrumbs.styles";

export const getElementOuterWidth = (element: Element): number =>
    element.clientWidth + parseFloat(getComputedStyle(element).marginLeft) + parseFloat(getComputedStyle(element).marginRight);

const NUMBER_OF_ITEMS_BEFORE_OVERFLOW_MENU = 1;

const useNumberOfItemsToBeHidden = (
    items: BreadcrumbItem[],
    containerWidth: number,
    showBackButton: boolean,
    itemWidths: number[] | undefined,
): number | undefined => {
    const [numberOfItemsToBeHidden, setNumberOfItemsToBeHidden] = React.useState<number | undefined>();

    React.useEffect(() => {
        let allVisibleItemsFitIntoContainer = false;
        let newNumberOfItemsToBeHidden = 0;

        const minimumNumberOfVisibleItems = 3; // First item, overflow menu & last item
        const maximumNumberOfHiddenItems = items.length - minimumNumberOfVisibleItems + 1;

        while (!allVisibleItemsFitIntoContainer && newNumberOfItemsToBeHidden < maximumNumberOfHiddenItems) {
            let totalWidthOfVisibleItems = 0;

            itemWidths?.forEach((itemWidth, index) => {
                const isOverflowMenu = index === NUMBER_OF_ITEMS_BEFORE_OVERFLOW_MENU;
                const overflowMenuWillBeShown = newNumberOfItemsToBeHidden > 0;
                const linkItemWillBeShown =
                    index === 0 || // Always show first item
                    index === itemWidths.length - 1 || // Alawys show last item
                    index > newNumberOfItemsToBeHidden + minimumNumberOfVisibleItems - 2;

                if ((isOverflowMenu && overflowMenuWillBeShown) || (!isOverflowMenu && linkItemWillBeShown)) {
                    totalWidthOfVisibleItems += itemWidth;
                }
            });

            if (totalWidthOfVisibleItems > containerWidth) {
                newNumberOfItemsToBeHidden++;
            } else {
                allVisibleItemsFitIntoContainer = true;
            }
        }

        setNumberOfItemsToBeHidden(newNumberOfItemsToBeHidden);
    }, [items, itemWidths, containerWidth, showBackButton, numberOfItemsToBeHidden]);

    return numberOfItemsToBeHidden;
};

export const useItemsToRender = (
    items: BreadcrumbItem[],
    containerWidth: number,
    classes: ClassNameMap<ClassKeyOfStyles<typeof styles>>,
    itemWidths: number[] | undefined,
    overflowLinkText: React.ReactNode,
    backButtonUrl: string | undefined,
): React.ReactNode[] => {
    const numberOfItemsToBeHidden = useNumberOfItemsToBeHidden(items, containerWidth, Boolean(backButtonUrl), itemWidths);

    if (!items.length) return [];

    const renderAllItemsToAllowCalculatingWidths = !itemWidths?.length;

    const itemsAfterOverflowMenu = renderAllItemsToAllowCalculatingWidths
        ? items.slice(NUMBER_OF_ITEMS_BEFORE_OVERFLOW_MENU)
        : items.slice(NUMBER_OF_ITEMS_BEFORE_OVERFLOW_MENU, items.length);

    const itemsInsideOverflowMenu = renderAllItemsToAllowCalculatingWidths ? [] : itemsAfterOverflowMenu.splice(0, numberOfItemsToBeHidden);

    const showOverflowMenu = Boolean(renderAllItemsToAllowCalculatingWidths || itemsInsideOverflowMenu.length);

    const firstItemWithBackButton = (
        <BreadcrumbsEntry item={items[0]} classes={classes} isLastItem={items.length === 1} backButtonUrl={backButtonUrl} />
    );
    const overflowMenu = <BreadcrumbsOverflow items={itemsInsideOverflowMenu} linkText={overflowLinkText} classes={classes} />;
    const remainingItems = itemsAfterOverflowMenu.map((item, index) => (
        <BreadcrumbsEntry key={item.id} item={item} classes={classes} isLastItem={index === itemsAfterOverflowMenu.length - 1} />
    ));

    return [firstItemWithBackButton, showOverflowMenu && overflowMenu, ...remainingItems].filter((item) => item !== false);
};
