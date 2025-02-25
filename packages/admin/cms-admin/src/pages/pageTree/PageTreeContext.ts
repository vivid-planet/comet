import { type DocumentNode } from "graphql";
import { createContext, type ReactNode } from "react";

import { type DocumentInterface, type DocumentType } from "../../documents/types";
import { type TreeMap } from "./treemap/TreeMapUtils";
import { type GQLPageTreePageFragment } from "./usePageTree";

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
