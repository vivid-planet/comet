import { breadcrumbsClasses } from "@mui/material";
import * as React from "react";

import { useStackApi } from "../Api";

const getElementOuterWidth = (element: HTMLElement): number =>
    element.offsetWidth + parseFloat(getComputedStyle(element).marginLeft) + parseFloat(getComputedStyle(element).marginRight);

const useSeparatorWidth = (breadcrumbsElement: HTMLElement | null): number | null => {
    const [separatorWidth, setSeparatorWidth] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (breadcrumbsElement) {
            const breadcrumbsListElement = breadcrumbsElement.getElementsByClassName(breadcrumbsClasses.ol)[0];

            if (separatorWidth === null) {
                const separatorElements = breadcrumbsListElement.getElementsByClassName(
                    breadcrumbsClasses.separator,
                ) as HTMLCollectionOf<HTMLElement>;

                if (separatorElements.length) {
                    const newSeparatorWidth = getElementOuterWidth(separatorElements[0]);
                    setSeparatorWidth(newSeparatorWidth);
                }
            }
        }
    }, [breadcrumbsElement, separatorWidth]);

    return separatorWidth;
};

type LinkWidths = {
    overflowLinkWidth: number | null;
    breadcrumbItemWidths: number[];
};

const useLinkWidths = (breadcrumbsElement: HTMLElement | null, itemsBeforeCollapse: number): LinkWidths => {
    const [breadcrumbItemWidths, setBreadcrumbItemWidths] = React.useState<number[]>([]);
    const [overflowLinkWidth, setOverflowLinkWidth] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (breadcrumbsElement) {
            const breadcrumbsListElement = breadcrumbsElement.getElementsByClassName(breadcrumbsClasses.ol)[0];

            if (breadcrumbItemWidths.length === 0 || overflowLinkWidth === null) {
                const itemWidths: number[] = [];
                const breadcrumbListItemElements = breadcrumbsListElement.getElementsByClassName(
                    breadcrumbsClasses.li,
                ) as HTMLCollectionOf<HTMLElement>;

                Array.from(breadcrumbListItemElements).forEach((breadcrumbsItemElement, index) => {
                    const itemWidth = getElementOuterWidth(breadcrumbsItemElement);

                    if (index === itemsBeforeCollapse) {
                        setOverflowLinkWidth(itemWidth);
                    } else {
                        itemWidths.push(itemWidth);
                    }
                });

                if (itemWidths.length) {
                    setBreadcrumbItemWidths(itemWidths);
                }
            }
        }
    }, [breadcrumbItemWidths.length, breadcrumbsElement, overflowLinkWidth, itemsBeforeCollapse]);

    return {
        overflowLinkWidth,
        breadcrumbItemWidths,
    };
};

export const useNumberOfItemsToBeHidden = (
    breadcrumbsElement: HTMLElement | null,
    breadcrumbsContainerWidth: number | null,
    itemsBeforeCollapse: number,
): number | null => {
    const stackApi = useStackApi();
    const totalNumberOfItems = stackApi?.breadCrumbs.length ?? 0;

    const separatorWidth = useSeparatorWidth(breadcrumbsElement);
    const { overflowLinkWidth, breadcrumbItemWidths } = useLinkWidths(breadcrumbsElement, itemsBeforeCollapse);
    const [numberOfItemsToBeHidden, setNumberOfItemsToBeHidden] = React.useState<number | null>(null);

    const minimumNumberOfVisibleBreadcrumbItems = itemsBeforeCollapse + 2; // +2 for the last item and the overflow link
    const maximumNumberOfHiddenBreadcrumbItems = totalNumberOfItems - minimumNumberOfVisibleBreadcrumbItems + 1; // +1 for the overflow link

    React.useEffect(() => {
        const allSizingInformationHasBeenSet =
            breadcrumbsContainerWidth !== null && separatorWidth !== null && overflowLinkWidth !== null && breadcrumbItemWidths.length;

        if (allSizingInformationHasBeenSet && breadcrumbsElement) {
            let newNumberOfItemsToBeHidden = 0;
            let allVisibleItemsFitIntoBreadcrumbs = false;

            while (!allVisibleItemsFitIntoBreadcrumbs && newNumberOfItemsToBeHidden < maximumNumberOfHiddenBreadcrumbItems) {
                const currentWidthOfOverflowLink = newNumberOfItemsToBeHidden === 0 ? 0 : overflowLinkWidth + separatorWidth;
                let totalWidthOfItems = 0;
                let numberOfItemsToBeHidden = 0;

                breadcrumbItemWidths.forEach((itemWidth, index) => {
                    const currentItemIsHidden = index >= itemsBeforeCollapse && numberOfItemsToBeHidden < newNumberOfItemsToBeHidden;

                    if (currentItemIsHidden) {
                        numberOfItemsToBeHidden++;
                    } else {
                        totalWidthOfItems += itemWidth + (index > 0 ? separatorWidth : 0);
                    }
                });

                if (totalWidthOfItems + currentWidthOfOverflowLink > breadcrumbsContainerWidth) {
                    newNumberOfItemsToBeHidden++;
                } else {
                    allVisibleItemsFitIntoBreadcrumbs = true;
                }
            }

            setNumberOfItemsToBeHidden(newNumberOfItemsToBeHidden);
        }
    }, [
        breadcrumbsElement,
        breadcrumbsContainerWidth,
        separatorWidth,
        overflowLinkWidth,
        breadcrumbItemWidths,
        maximumNumberOfHiddenBreadcrumbItems,
        itemsBeforeCollapse,
    ]);

    return numberOfItemsToBeHidden;
};
