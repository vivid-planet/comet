import { BreadcrumbItem, Stack, StackBreadcrumbs, useStackApi } from "@comet/admin";
import { select } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

const singleItem: BreadcrumbItem[] = [{ id: "one", parentId: "", url: "/one", title: "Breadcrumb One" }];
const twoItems: BreadcrumbItem[] = [...singleItem, { id: "two", parentId: "one", url: "/two", title: "BC 2" }];
const threeItems: BreadcrumbItem[] = [...twoItems, { id: "three", parentId: "two", url: "/three", title: "BrdCrmb 3" }];
const fiveItems: BreadcrumbItem[] = [
    ...threeItems,
    { id: "four", parentId: "three", url: "/four", title: "Really long Breadcrumb Number Four" },
    { id: "five", parentId: "four", url: "/five", title: "Breadcrumb Five" },
];
const eightItems: BreadcrumbItem[] = [
    ...fiveItems,
    { id: "six", parentId: "five", url: "/six", title: "Breadcrumb Six" },
    { id: "seven", parentId: "six", url: "/seven", title: "BrdCrmb 7" },
    { id: "eight", parentId: "seven", url: "/eight", title: "Breadcrumb Eight" },
];

const allBradcrumbItemsGroupOne: Record<string, BreadcrumbItem[]> = {
    Single: singleItem,
    Two: twoItems,
    Three: threeItems,
    Five: fiveItems,
    Eight: eightItems,
};

const allBradcrumbItemsGroupTwo: Record<string, BreadcrumbItem[]> = {
    Single: singleItem.map((item) => ({ ...item, title: `${item.title} group 2` })),
    Two: twoItems.map((item) => ({ ...item, title: `${item.title} group 2` })),
    Three: threeItems.map((item) => ({ ...item, title: `${item.title} group 2` })),
    Five: fiveItems.map((item) => ({ ...item, title: `${item.title} group 2` })),
    Eight: eightItems.map((item) => ({ ...item, title: `${item.title} group 2` })),
};

const allBreadcrumbGroups: Record<string, Record<string, BreadcrumbItem[]>> = {
    Normal: allBradcrumbItemsGroupOne,
    "Increased length": allBradcrumbItemsGroupTwo,
};

function Story() {
    const stackApi = useStackApi();
    if (!stackApi) return null;
    const selectedBreadcrumbsNumberKey = select("Number of items", Object.keys(allBradcrumbItemsGroupOne), "Three");
    const selectedBreadcrumbsGroupKey = select("Item group", Object.keys(allBreadcrumbGroups), Object.keys(allBreadcrumbGroups)[0]);
    stackApi.breadCrumbs = allBreadcrumbGroups[selectedBreadcrumbsGroupKey][selectedBreadcrumbsNumberKey];
    return <StackBreadcrumbs />;
}

storiesOf("@comet/admin/stack", module)
    .addDecorator(storyRouterDecorator())
    .add("Stack Breadcrumbs", () => (
        <Stack topLevelTitle="Stack">
            <Story />
        </Stack>
    ));
