import { createMock } from "@golevelup/ts-vitest";
import { describe, expect, it, vi } from "vitest";

import type { User } from "./interfaces/user";
import { summarizeContentScopesByDimension, UserContentScopesLoaderService } from "./user-content-scopes-loader.service";
import type { UserPermissionsService } from "./user-permissions.service";

describe("UserContentScopesLoaderService", () => {
    describe("summarizeContentScopesByDimension", () => {
        it("counts the distinct values per dimension", () => {
            expect(
                summarizeContentScopesByDimension([
                    { domain: "main", language: "en" },
                    { domain: "secondary", language: "de" },
                    { domain: "main", language: "en" },
                ]),
            ).toEqual([
                { dimension: "domain", count: 2 },
                { dimension: "language", count: 2 },
            ]);
        });

        it("reports a wildcard dimension as all values", () => {
            expect(summarizeContentScopesByDimension([{ domain: "main", language: "*" }])).toEqual([
                { dimension: "domain", count: 1 },
                { dimension: "language", count: "*" },
            ]);
        });
    });

    describe("load", () => {
        it("computes the available content scopes only once when loading multiple users", async () => {
            const userPermissionsService = createMock<UserPermissionsService>({
                getAvailableContentScopes: vi.fn(async () => [
                    { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
                ]),
                filterContentScopesForUser: async () => [{ domain: "main", language: "en" }],
            });
            const loader = new UserContentScopesLoaderService(userPermissionsService);

            const [userA, userB] = await Promise.all([loader.load({ id: "a" } as User), loader.load({ id: "b" } as User)]);

            expect(userPermissionsService.getAvailableContentScopes).toHaveBeenCalledTimes(1);
            expect(userA).toEqual([
                { dimension: "domain", count: 1 },
                { dimension: "language", count: 1 },
            ]);
            expect(userB).toEqual(userA);
        });
    });
});
