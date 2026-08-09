import { describe, expect, it, vi } from "vitest";

import type { CurrentUser } from "../user-permissions/dto/current-user";
import type { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import { isAllowedToAccessScope } from "./is-allowed-to-access-scope";

const user = { id: "1" } as CurrentUser;
const scope = { domain: "main" };

function createAccessControlService(isAllowed: boolean): AccessControlServiceInterface {
    return { isAllowed: vi.fn().mockReturnValue(isAllowed) };
}

describe("isAllowedToAccessScope", () => {
    it("denies access when no access control service is available", () => {
        expect(isAllowedToAccessScope({ accessControlService: undefined, disableScopeAccessControl: undefined, user, scope })).toBe(false);
    });

    it("grants access when the check is disabled and no access control service is available", () => {
        expect(isAllowedToAccessScope({ accessControlService: undefined, disableScopeAccessControl: true, user, scope })).toBe(true);
    });

    it("asks the access control service for the dam permission", () => {
        const accessControlService = createAccessControlService(true);

        expect(isAllowedToAccessScope({ accessControlService, disableScopeAccessControl: undefined, user, scope })).toBe(true);
        expect(accessControlService.isAllowed).toHaveBeenCalledWith(user, "dam", scope);
    });

    it("denies access when the access control service denies it", () => {
        expect(
            isAllowedToAccessScope({ accessControlService: createAccessControlService(false), disableScopeAccessControl: undefined, user, scope }),
        ).toBe(false);
    });

    it("skips the access control service when the check is disabled", () => {
        const accessControlService = createAccessControlService(false);

        expect(isAllowedToAccessScope({ accessControlService, disableScopeAccessControl: true, user, scope })).toBe(true);
        expect(accessControlService.isAllowed).not.toHaveBeenCalled();
    });
});
