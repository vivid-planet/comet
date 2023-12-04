import { TypedDocumentNode } from "@apollo/client";
import { BlockInterface } from "@comet/blocks-admin";
import { DependencyInterface } from "@comet/cms-admin";
import { createDependencyMethods } from "@comet/cms-admin/lib/dependencies/createDependencyMethods";
import { categoryToUrlParam } from "@src/utils/pageTreeNodeCategoryMapping";

import { GQLPageTreeNodeCategory, Maybe } from "../graphql.generated";

interface Query {
    node: Maybe<{
        id: string;
        [key: string]: unknown;
        pageTreeNode: Maybe<{
            id: string;
            category: GQLPageTreeNodeCategory;
        }>;
    }>;
}

interface QueryVariables {
    id: string;
}

export function createDocumentDependencyMethods({
    rootBlocks,
    prefixes,
    query,
}: {
    rootBlocks: Record<string, BlockInterface>;
    prefixes?: Record<string, string>;
    query: TypedDocumentNode<Query, QueryVariables>;
}): Pick<DependencyInterface, "resolveUrl"> {
    return createDependencyMethods({
        rootBlocks,
        prefixes,
        query,
        buildUrl: (id, data: Query, { contentScopeUrl, blockUrl }) => {
            if (data.node === null || data.node.pageTreeNode === null) {
                throw new Error(`Could not find PageTreeNode for document ${id}`);
            }

            return `${contentScopeUrl}/pages/pagetree/${categoryToUrlParam(data.node.pageTreeNode.category)}/${
                data.node.pageTreeNode.id
            }/edit/${blockUrl}`;
        },
    });
}
