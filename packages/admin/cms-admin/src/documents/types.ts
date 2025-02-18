import { type TypedDocumentNode } from "@apollo/client";
import { type SvgIconProps } from "@mui/material";
import { type ComponentType, type ReactNode } from "react";

import { type BlockDependency, type ReplaceDependencyObject } from "../blocks/types";
import { type GQLDocumentInterface, type Maybe } from "../graphql.generated";
import { type PageTreePage } from "../pages/pageTree/usePageTree";

export type DocumentType = string;

export interface GQLPageQuery {
    page: Maybe<{
        document: Maybe<GQLDocument>;
    }>;
}

export interface GQLPageQueryVariables {
    id: string;
}

interface GQLUpdatePageMutation {
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
    DocumentOutput extends Record<string, unknown> = Record<string, unknown>,
> {
    displayName: ReactNode;
    getQuery?: TypedDocumentNode<GQLPageQuery, GQLPageQueryVariables>; // TODO better typing (see createUsePage.tsx)
    editComponent?: ComponentType<{ id: string; category: string }>;
    updateMutation?: TypedDocumentNode<GQLUpdatePageMutation, GQLUpdatePageMutationVariables<DocumentOutput>>;
    inputToOutput?: (input: DocumentInput) => DocumentOutput;
    menuIcon: (props: SvgIconProps<"svg">) => ReactNode;
    hideInMenuIcon?: (props: SvgIconProps<"svg">) => ReactNode;
    InfoTag?: ComponentType<{ page: PageTreePage }>;
    anchors: (input: DocumentInput) => string[];
    dependencies: (input: DocumentInput) => BlockDependency[];
    replaceDependenciesInOutput: (output: DocumentOutput, replacements: ReplaceDependencyObject[]) => DocumentOutput;
    hasNoSitePreview?: true;
}
