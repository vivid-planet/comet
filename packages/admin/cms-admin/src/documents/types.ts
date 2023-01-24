import { TypedDocumentNode } from "@apollo/client";
import { SvgIconProps } from "@mui/material";

import { GQLDocumentInterface, Maybe } from "../graphql.generated";
import { PageTreePage } from "../pages/pageTree/usePageTree";

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

export type IdsMap = Map<string, string>;

export interface DocumentInterface<
    DocumentInput extends Record<string, unknown> = Record<string, unknown>,
    DocumentOutput extends Record<string, unknown> = Record<string, unknown>,
> {
    displayName: React.ReactNode;
    getQuery?: TypedDocumentNode<GQLPageQuery, GQLPageQueryVariables>; // TODO better typing (see createUsePage.tsx)
    editComponent?: React.ComponentType<{ id: string; category: string }>;
    updateMutation?: TypedDocumentNode<GQLUpdatePageMutation, GQLUpdatePageMutationVariables<DocumentInput>>;
    inputToOutput?: (input: DocumentInput, context: { idsMap: IdsMap }) => DocumentOutput;
    menuIcon: (props: SvgIconProps<"svg">) => JSX.Element | null;
    hideInMenuIcon?: (props: SvgIconProps<"svg">) => JSX.Element | null;
    InfoTag?: React.ComponentType<{ page: PageTreePage }>;
    anchors: (input: DocumentInput) => string[];
    resolveDependencyRoute: (input: DocumentInput, { rootColumn, jsonPath }: { rootColumn: string; jsonPath: string }) => string;
}
