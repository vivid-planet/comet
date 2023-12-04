import { GQLPageTreeNodeCategory } from "@src/graphql.generated";

interface Category {
    category: GQLPageTreeNodeCategory;
    urlParam: string;
}

const categories: Array<Category> = [
    {
        category: "MainNavigation",
        urlParam: "main-navigation",
    },
    {
        category: "TopMenu",
        urlParam: "top-menu",
    },
];

function categoryToUrlParam(category: GQLPageTreeNodeCategory): string {
    const urlParam = categories.find((c) => c.category === category)?.urlParam;
    return urlParam ?? categories[0].urlParam;
}

function urlParamToCategory(param: string | undefined): GQLPageTreeNodeCategory | undefined {
    return categories.find((c) => c.urlParam === param)?.category;
}

export { categoryToUrlParam, urlParamToCategory };
