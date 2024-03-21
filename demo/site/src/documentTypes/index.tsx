import PageTypePage, { loader as pageTypePageLoader } from "@src/documentTypes/Page";
import { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import { GraphQLClient } from "graphql-request";

export type DocumentTypeLoaderOptions = { client: GraphQLClient; pageTreeNodeId: string; scope: GQLPageTreeNodeScopeInput };
export type InferDocumentTypeLoaderPropsType<T> = T extends (options: DocumentTypeLoaderOptions) => Promise<infer Return> ? Return : never;

type DocumentLoader<T = Record<string, unknown>> = (options: DocumentTypeLoaderOptions) => Promise<T>;
type DocumentType<T = Record<string, unknown>> = { component: React.ComponentType<T>; loader: DocumentLoader<T> };

export const documentTypes: Record<string, DocumentType> = {
    Page: {
        component: PageTypePage,
        loader: pageTypePageLoader,
    },
};
