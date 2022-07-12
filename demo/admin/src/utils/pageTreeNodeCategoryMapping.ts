import { GQLPageTreeNodeCategory } from "@src/graphql.generated";

function categoryToUrlParam(category: GQLPageTreeNodeCategory): string {
    switch (category) {
        case "MainNavigation":
            return "main-navigation";
    }
}

function urlParamToCategory(param: string | undefined): GQLPageTreeNodeCategory | null {
    switch (param) {
        case "main-navigation":
            return "MainNavigation";
        default:
            return null;
    }
}

export { categoryToUrlParam, urlParamToCategory };
