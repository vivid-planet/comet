import * as React from "react";

import { DocumentInterface, DocumentType } from "../../documents/types";
import { GQLPageTreePageFragment } from "../../graphql.generated";
import { TreeMap } from "./treemap/TreeMapUtils";

export type AllCategories = Array<{ category: string; label: React.ReactNode }>;

export interface PageTreeContext {
    allCategories: AllCategories;
    documentTypes: Record<DocumentType, DocumentInterface>;
    tree: TreeMap<GQLPageTreePageFragment>;
}

export const PageTreeContext = React.createContext<PageTreeContext | undefined>(undefined);
