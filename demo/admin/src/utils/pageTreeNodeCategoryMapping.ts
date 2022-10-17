import { GQLPageTreeNodeCategory } from "@src/graphql.generated";

function categoryToUrlParam(category: GQLPageTreeNodeCategory): string {
    switch (category) {
        case "TopMenu":
            return "top-menu";
        case "MainNavigation":
        default:
            return "main-navigation";
    }
}

function urlParamToCategory(param: string | undefined): GQLPageTreeNodeCategory | undefined {
    switch (param) {
        case "top-menu":
            return "TopMenu";
        case "main-navigation":
            return "MainNavigation";
    }
}

export { categoryToUrlParam, urlParamToCategory };
