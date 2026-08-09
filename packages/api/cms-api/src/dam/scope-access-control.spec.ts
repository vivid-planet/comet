import { describe, expect, it, vi } from "vitest";

import type { CurrentUser } from "../user-permissions/dto/current-user";
import type { AccessControlServiceInterface } from "../user-permissions/user-permissions.types";
import { assertScopeAccessControlIsConfigured, isAllowedToAccessScope } from "./scope-access-control";

const user = { id: "1" } as CurrentUser;
const scope = { domain: "main" };

function createAccessControlService(isAllowed: boolean): AccessControlServiceInterface {
    return { isAllowed: vi.fn().mockReturnValue(isAllowed) };
}

describe("assertScopeAccessControlIsConfigured", () => {
    it("throws when no access control service is available", () => {
        expect(() => assertScopeAccessControlIsConfigured({ accessControlService: undefined, disableScopeAccessControl: undefined })).toThrow(
            /no AccessControlService is available/,
        );
    });

    it("passes when an access control service is available", () => {
        expect(() =>
            assertScopeAccessControlIsConfigured({ accessControlService: createAccessControlService(true), disableScopeAccessControl: undefined }),
        ).not.toThrow();
    });

    it("passes without an access control service when the checks are disabled", () => {
        expect(() => assertScopeAccessControlIsConfigured({ accessControlService: undefined, disableScopeAccessControl: true })).not.toThrow();
    });
});

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
