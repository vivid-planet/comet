import { type CustomDecorator, SetMetadata } from "@nestjs/common";

export const SKIP_DAM_SCOPE_ACCESS_CONTROL_METADATA_KEY = "skipDamScopeAccessControl";

// Marks a DAM file/folder endpoint as not requiring scope-based access control, e.g. publicly accessible, hash-signed downloads.
export const SkipDamScopeAccessControl = (): CustomDecorator => SetMetadata(SKIP_DAM_SCOPE_ACCESS_CONTROL_METADATA_KEY, true);
