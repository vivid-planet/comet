import { CustomDecorator, SetMetadata } from "@nestjs/common";

export const allowForRoleMetadataKey = "allowForRole";

export const AllowForRole = (...roles: string[]): CustomDecorator<string | string[]> => SetMetadata(allowForRoleMetadataKey, roles);
