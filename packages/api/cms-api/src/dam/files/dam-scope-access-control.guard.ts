import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, Optional } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ACCESS_CONTROL_SERVICE } from "../../user-permissions/user-permissions.constants";
import { AccessControlServiceInterface } from "../../user-permissions/user-permissions.types";
import { DAM_SCOPE_ACCESS_CONTROL_DISABLED } from "../dam.constants";
import { SKIP_DAM_SCOPE_ACCESS_CONTROL_METADATA_KEY } from "./skip-dam-scope-access-control.decorator";

// Gates the DAM file/folder endpoints: the per-scope checks in the controllers only run when an access control service is
// available, so without this guard they would be silently skipped when none is registered. Fail closed instead and require
// the application to opt out explicitly when it handles authorization itself (e.g. via its own guard in a standalone service).
@Injectable()
export class DamScopeAccessControlGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @Inject(DAM_SCOPE_ACCESS_CONTROL_DISABLED) private readonly scopeAccessControlDisabled: boolean,
        @Optional() @Inject(ACCESS_CONTROL_SERVICE) private readonly accessControlService?: AccessControlServiceInterface,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const skipScopeAccessControl = this.reflector.getAllAndOverride<boolean>(SKIP_DAM_SCOPE_ACCESS_CONTROL_METADATA_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (skipScopeAccessControl) {
            return true;
        }

        if (!this.accessControlService && !this.scopeAccessControlDisabled) {
            throw new ForbiddenException(
                "DAM scope access control is not available. Register an access control service or set `disableScopeAccessControl: true` on the DAM module to handle authorization outside of the DAM module.",
            );
        }

        return true;
    }
}
