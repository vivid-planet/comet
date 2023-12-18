import { DocumentNode } from "graphql";
import * as React from "react";

import { DocumentInterface, DocumentType } from "../../documents/types";
import { TreeMap } from "./treemap/TreeMapUtils";
import { GQLPageTreePageFragment } from "./usePageTree";

export type AllCategories = Array<{ category: string; label: React.ReactNode }>;

export interface PageTreeContext {
    allCategories: AllCategories;
    activeCategory: string;
    documentTypes: Record<DocumentType, DocumentInterface>;
    tree: TreeMap<GQLPageTreePageFragment>;
    query: DocumentNode;
}

export const PageTreeContext = React.createContext<PageTreeContext | undefined>(undefined);
