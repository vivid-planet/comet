import { createSchema } from "./schema";

export const { damFiles, damFolders, damFileImages, userPermissions, roles, userRoles, groupRoles } = createSchema("postgresql");
