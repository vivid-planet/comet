import { Breadcrumbs, type BreadcrumbsItemProps } from "@comet/admin";

export default {
    title: "@comet/admin/Breadcrumbs",
};

const singleItem: BreadcrumbsItemProps[] = [{ id: "one", url: "/one", title: "Breadcrumb One" }];
const twoItems: BreadcrumbsItemProps[] = [...singleItem, { id: "two", url: "/two", title: "BC 2" }];
const threeItems: BreadcrumbsItemProps[] = [...twoItems, { id: "three", url: "/three", title: "BrdCrmb 3" }];
const fiveItems: BreadcrumbsItemProps[] = [
    ...threeItems,
    { id: "four", url: "/four", title: "Really long Breadcrumb Number Four" },
    { id: "five", url: "/five", title: "Breadcrumb Five" },
];
const sevenItems: BreadcrumbsItemProps[] = [
    ...fiveItems,
    { id: "six", url: "/six", title: "Breadcrumb Six" },
    { id: "seven", url: "/seven", title: "Breadcrumb Seven" },
];

export const Single = () => {
    return <Breadcrumbs items={singleItem} />;
};

export const Two = () => {
    return <Breadcrumbs items={twoItems} />;
};

export const Three = () => {
    return <Breadcrumbs items={threeItems} />;
};

export const Five = () => {
    return <Breadcrumbs items={fiveItems} />;
};

export const Seven = () => {
    return <Breadcrumbs items={sevenItems} />;
};
