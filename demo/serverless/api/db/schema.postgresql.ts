import { createSchema } from "./schema";

export const { damFiles, damFolders, damFileImages, pageTreeNodes, userPermissions, roles, userRoles, groupRoles } = createSchema("postgresql");
