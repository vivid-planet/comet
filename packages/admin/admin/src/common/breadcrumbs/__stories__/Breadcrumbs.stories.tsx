import { Breadcrumbs, type BreadcrumbsItemProps } from "../Breadcrumbs";

export default {
    title: "components/breadcrumbs/Breadcrumbs",
};

const singleItem: BreadcrumbsItemProps[] = [{ url: "/one", title: "Breadcrumb One" }];
const twoItems: BreadcrumbsItemProps[] = [...singleItem, { url: "/two", title: "BC 2" }];
const threeItems: BreadcrumbsItemProps[] = [...twoItems, { url: "/three", title: "BrdCrmb 3" }];
const fiveItems: BreadcrumbsItemProps[] = [
    ...threeItems,
    { url: "/four", title: "Really long Breadcrumb Number Four" },
    { url: "/five", title: "Breadcrumb Five" },
];
const sevenItems: BreadcrumbsItemProps[] = [...fiveItems, { url: "/six", title: "Breadcrumb Six" }, { url: "/seven", title: "Breadcrumb Seven" }];

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
