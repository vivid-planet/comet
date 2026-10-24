/** Shared by the API's config and the admin, which adds labels and icons */
export const pageTreeCategories = ["mainNavigation", "topMenu"] as const;

export type PageTreeCategory = (typeof pageTreeCategories)[number];

export const pageTreeDocumentTypes = ["Page", "Link"] as const;
