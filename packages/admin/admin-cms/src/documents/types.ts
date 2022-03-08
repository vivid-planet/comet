import { TypedDocumentNode } from "@apollo/client";

import { GQLDocumentInterface, GQLPageTreeNodeCategory, Maybe } from "../graphql.generated";

export type DocumentType = string;

export interface GQLPageQuery {
    page: Maybe<{
        document: Maybe<GQLDocument>;
    }>;
}

export interface GQLPageQueryVariables {
    id: string;
}

export interface GQLUpdatePageMutation {
    id: string;
}

export interface GQLUpdatePageMutationVariables<DocumentOutput = Record<string, unknown>> {
    pageId: string;
    input: DocumentOutput;
    attachedPageTreeNodeId?: string | null;
}

export interface GQLDocument extends GQLDocumentInterface {
    __typename: DocumentType;
    [key: string]: unknown;
}

export interface DocumentInterface<
    DocumentInput extends Record<string, unknown> = Record<string, unknown>,
    DocumentOutput extends Record<string, unknown> = Record<string, unknown>
> {
    displayName: React.ReactNode;
    getQuery?: TypedDocumentNode<GQLPageQuery, GQLPageQueryVariables>; // TODO better typing (see createUsePage.tsx)
    editComponent?: React.ComponentType<{ id: string; category: GQLPageTreeNodeCategory }>;
    updateMutation?: TypedDocumentNode<GQLUpdatePageMutation, GQLUpdatePageMutationVariables<DocumentInput>>;
    inputToOutput?: (input: DocumentInput) => DocumentOutput;
}
