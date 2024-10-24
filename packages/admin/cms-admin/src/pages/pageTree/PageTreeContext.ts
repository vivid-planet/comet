import { DocumentNode } from "graphql";
import { createContext, ReactNode } from "react";

import { DocumentInterface, DocumentType } from "../../documents/types";
import { TreeMap } from "./treemap/TreeMapUtils";
import { GQLPageTreePageFragment } from "./usePageTree";

export type AllCategories = Array<{ category: string; label: ReactNode }>;

export interface PageTreeContext {
    allCategories: AllCategories;
    currentCategory: string;
    documentTypes: Record<DocumentType, DocumentInterface>;
    getDocumentTypesByCategory?: (category: string) => Record<DocumentType, DocumentInterface>;
    tree: TreeMap<GQLPageTreePageFragment>;
    query: DocumentNode;
}

export const PageTreeContext = createContext<PageTreeContext | undefined>(undefined);
