import { type DocumentNode } from "graphql";

import { useCometConfig } from "../config/CometConfigContext";
import { type DocumentInterface, type DocumentType } from "../documents/types";
import { type AllCategories } from "./pageTree/PageTreeContext";

export interface PageTreeConfig {
    categories: AllCategories;
    documentTypes: Record<DocumentType, DocumentInterface>;
    additionalPageTreeNodeFragment?: {
        name: string;
        fragment: DocumentNode;
    };
    scopeParts?: string[];
}

export function usePageTreeConfig(): PageTreeConfig {
    const cometConfig = useCometConfig();

    if (!cometConfig.pageTree) {
        throw new Error("No page tree configuration found. Make sure to set `pageTree` in `CometConfigProvider`.");
    }

    return cometConfig.pageTree;
}
