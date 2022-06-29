import { DocumentNode } from "graphql";
import * as React from "react";

import { DocumentInterface, DocumentType } from "../../documents/types";
import { GQLPageTreeNodeCategory, GQLPageTreePageFragment } from "../../graphql.generated";
import { TreeMap } from "./treemap/TreeMapUtils";

export type AllCategories = Array<{ category: GQLPageTreeNodeCategory; label: React.ReactNode }>;

export interface PageTreeContext {
    allCategories: AllCategories;
    documentTypes: Record<DocumentType, DocumentInterface>;
    tree: TreeMap<GQLPageTreePageFragment>;
    query: DocumentNode;
}

export const PageTreeContext = React.createContext<PageTreeContext | undefined>(undefined);
