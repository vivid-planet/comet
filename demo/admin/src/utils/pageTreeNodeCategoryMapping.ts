import { GQLPageTreeNodeCategory } from "@src/graphql.generated";
import { pageTreeCategories } from "@src/pages/pageTreeCategories";
import { kebabCase, pascalCase } from "change-case";

const isCategory = (category: string): category is GQLPageTreeNodeCategory => {
    return !!pageTreeCategories.find((c) => c.category === category);
};

function categoryToUrlParam(category: GQLPageTreeNodeCategory): string {
    return kebabCase(category);
}

function urlParamToCategory(param: string | undefined): GQLPageTreeNodeCategory | undefined {
    if (param === undefined) {
        return;
    }

    const category = pascalCase(param);
    return isCategory(category) ? category : undefined;
}

export { categoryToUrlParam, urlParamToCategory };
