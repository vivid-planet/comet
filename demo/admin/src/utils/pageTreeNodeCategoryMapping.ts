import { GQLPageTreeNodeCategory } from "@src/graphql.generated";
import { kebabCase, pascalCase } from "change-case";

function categoryToUrlParam(category: GQLPageTreeNodeCategory): string {
    return kebabCase(category);
}

function urlParamToCategory(param: string | undefined): GQLPageTreeNodeCategory | undefined {
    return param ? (pascalCase(param) as GQLPageTreeNodeCategory) : undefined;
}

export { categoryToUrlParam, urlParamToCategory };
