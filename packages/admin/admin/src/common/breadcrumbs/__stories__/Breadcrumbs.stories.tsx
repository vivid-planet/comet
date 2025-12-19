import { Breadcrumbs, type BreadcrumbsItem } from "../Breadcrumbs";

export default {
    title: "components/breadcrumbs/Breadcrumbs",
};

const singleItem: BreadcrumbsItem[] = [{ url: "/one", title: "Breadcrumb One" }];
const twoItems: BreadcrumbsItem[] = [...singleItem, { url: "/two", title: "BC 2" }];
const threeItems: BreadcrumbsItem[] = [...twoItems, { url: "/three", title: "BrdCrmb 3" }];
const fiveItems: BreadcrumbsItem[] = [
    ...threeItems,
    { url: "/four", title: "Really long Breadcrumb Number Four" },
    { url: "/five", title: "Breadcrumb Five" },
];
const sevenItems: BreadcrumbsItem[] = [...fiveItems, { url: "/six", title: "Breadcrumb Six" }, { url: "/seven", title: "Breadcrumb Seven" }];

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
