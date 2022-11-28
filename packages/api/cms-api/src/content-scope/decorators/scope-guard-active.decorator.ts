import { CustomDecorator, SetMetadata } from "@nestjs/common";

const SCOPE_GUARD_ACTIVE_METADATA_KEY = "scopeGuardActive";

type ScopeGuardActiveMetadataValue = boolean;

const ScopeGuardActive = (active: boolean): CustomDecorator<string> => {
    return SetMetadata(SCOPE_GUARD_ACTIVE_METADATA_KEY, active);
};

export { SCOPE_GUARD_ACTIVE_METADATA_KEY, ScopeGuardActive };
export type { ScopeGuardActiveMetadataValue };
