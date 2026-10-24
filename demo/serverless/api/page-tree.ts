import type { PageTreeConfig } from "@dextinity/serverless-page-tree/server";

import { pageTreeCategories, pageTreeDocumentTypes } from "../shared/page-tree";

export const pageTreeConfig: PageTreeConfig = {
    categories: pageTreeCategories,
    documentTypes: pageTreeDocumentTypes,
};
