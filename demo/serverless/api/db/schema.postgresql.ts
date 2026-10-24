import { createSchema } from "./schema";

export const { damFiles, damFolders, damFileImages, pageTreeNodes, pageTreeDocuments, userPermissions, roles, userRoles, groupRoles } =
    createSchema("postgresql");
