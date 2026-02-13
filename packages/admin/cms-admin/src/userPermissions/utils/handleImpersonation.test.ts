import Cookies from "js-cookie";
import { beforeEach, describe, expect, it } from "vitest";

import { contentScopeLocalStorageKey } from "../../contentScope/ContentScopeSelect";
import { startImpersonation, stopImpersonation } from "./handleImpersonation";

describe("handleImpersonation", () => {
    beforeEach(() => {
        // Clear cookies and localStorage before each test
        Cookies.remove("comet-impersonate-user-id");
        localStorage.clear();

        // Mock location.href
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).location;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.location = { href: "/" } as any;
    });

    describe("startImpersonation", () => {
        it("should set impersonation cookie", async () => {
            const userId = "user-123";

            await startImpersonation(userId);

            expect(Cookies.get("comet-impersonate-user-id")).toBe(userId);
        });

        it("should clear stored scope from localStorage", async () => {
            const userId = "user-123";
            const storedScope = { domain: "main", language: "en" };

            // Store a scope before impersonation
            localStorage.setItem(contentScopeLocalStorageKey, JSON.stringify(storedScope));

            await startImpersonation(userId);

            // The stored scope should be cleared
            expect(localStorage.getItem(contentScopeLocalStorageKey)).toBeNull();
        });

        it("should redirect to root", async () => {
            const userId = "user-123";

            await startImpersonation(userId);

            expect(window.location.href).toBe("/");
        });
    });

    describe("stopImpersonation", () => {
        it("should remove impersonation cookie", async () => {
            // Set impersonation cookie first
            Cookies.set("comet-impersonate-user-id", "user-123");

            await stopImpersonation();

            expect(Cookies.get("comet-impersonate-user-id")).toBeUndefined();
        });

        it("should redirect to root", async () => {
            await stopImpersonation();

            expect(window.location.href).toBe("/");
        });

        it("should not clear localStorage scope when stopping impersonation", async () => {
            const storedScope = { domain: "main", language: "en" };

            // Store a scope
            localStorage.setItem(contentScopeLocalStorageKey, JSON.stringify(storedScope));

            await stopImpersonation();

            // The stored scope should remain (original user's scope)
            expect(localStorage.getItem(contentScopeLocalStorageKey)).toBe(JSON.stringify(storedScope));
        });
    });
});
