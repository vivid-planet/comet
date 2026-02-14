import { MockedProvider } from "@apollo/client/testing";
import { RouterMemoryRouter } from "@comet/admin";
import { cleanup, render, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { useLocation } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CurrentUserContext } from "../userPermissions/hooks/currentUser";
import { contentScopeLocalStorageKey } from "./ContentScopeSelect";
import { ContentScopeProvider } from "./Provider";

describe("ContentScopeProvider", () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Mock location
        Object.defineProperty(window, "location", {
            value: { pathname: "/" },
            writable: true,
        });
    });

    let currentPathname: string;
    function LocationCapture() {
        currentPathname = useLocation().pathname;
        return null;
    }

    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <MockedProvider>
                <CurrentUserContext.Provider
                    value={{
                        currentUser: {
                            id: "1",
                            name: "Test User",
                            email: "test@example.com",
                            impersonated: false,
                            authenticatedUser: null,
                            permissions: [],
                            allowedContentScopes: [],
                        },
                        isAllowed: () => true,
                    }}
                >
                    <RouterMemoryRouter>
                        {children}
                        <LocationCapture />
                    </RouterMemoryRouter>
                </CurrentUserContext.Provider>
            </MockedProvider>
        );
    }

    it("should use stored scope when it is in allowed scopes", async () => {
        const allowedScopes = [
            { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "EN" } },
            { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "DE" } },
        ];
        const storedScope = { domain: "main", language: "de" };

        // Store a scope that is allowed
        localStorage.setItem(contentScopeLocalStorageKey, JSON.stringify(storedScope));

        const { container } = render(
            <Wrapper>
                <ContentScopeProvider values={allowedScopes} defaultValue={allowedScopes[0].scope}>
                    {/* eslint-disable-next-line @calm/react-intl/missing-formatted-message */}
                    {() => <div>Content</div>}
                </ContentScopeProvider>
            </Wrapper>,
        );

        await waitFor(() => {
            expect(container.textContent).toContain("Content");
        });

        // The stored scope should still be in localStorage since it's valid
        expect(localStorage.getItem(contentScopeLocalStorageKey)).toBe(JSON.stringify(storedScope));
        // URL should reflect the stored scope
        expect(currentPathname).toBe("/main/de");
    });

    it("should clear stored scope when it is not in allowed scopes", async () => {
        const allowedScopes = [
            { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "EN" } },
            { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "DE" } },
        ];
        const storedScope = { domain: "secondary", language: "fr" }; // Not in allowed scopes

        // Store a scope that is NOT allowed
        localStorage.setItem(contentScopeLocalStorageKey, JSON.stringify(storedScope));

        const { container } = render(
            <Wrapper>
                <ContentScopeProvider values={allowedScopes} defaultValue={allowedScopes[0].scope}>
                    {/* eslint-disable-next-line @calm/react-intl/missing-formatted-message */}
                    {() => <div>Content</div>}
                </ContentScopeProvider>
            </Wrapper>,
        );

        await waitFor(() => {
            expect(container.textContent).toContain("Content");
        });

        // The stored scope should be cleared from localStorage since it's invalid
        expect(localStorage.getItem(contentScopeLocalStorageKey)).toBeNull();
        // URL should fall back to the default scope
        expect(currentPathname).toBe("/main/en");
    });

    it("should use default scope when no scope is stored", async () => {
        const allowedScopes = [
            { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "EN" } },
            { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "DE" } },
        ];

        // No stored scope

        const { container } = render(
            <Wrapper>
                <ContentScopeProvider values={allowedScopes} defaultValue={allowedScopes[0].scope}>
                    {/* eslint-disable-next-line @calm/react-intl/missing-formatted-message */}
                    {() => <div>Content</div>}
                </ContentScopeProvider>
            </Wrapper>,
        );

        await waitFor(() => {
            expect(container.textContent).toContain("Content");
        });

        // No scope should be stored
        expect(localStorage.getItem(contentScopeLocalStorageKey)).toBeNull();
        // URL should use the default scope
        expect(currentPathname).toBe("/main/en");
    });

    it("should handle partial scope matches correctly", async () => {
        const allowedScopes = [
            { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "EN" } },
            { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "DE" } },
        ];
        const storedScope = { domain: "main" }; // Partial match - missing language

        // Store a partial scope
        localStorage.setItem(contentScopeLocalStorageKey, JSON.stringify(storedScope));

        const { container } = render(
            <Wrapper>
                <ContentScopeProvider values={allowedScopes} defaultValue={allowedScopes[0].scope}>
                    {/* eslint-disable-next-line @calm/react-intl/missing-formatted-message */}
                    {() => <div>Content</div>}
                </ContentScopeProvider>
            </Wrapper>,
        );

        await waitFor(() => {
            expect(container.textContent).toContain("Content");
        });

        // The partial scope should be cleared since it doesn't exactly match any allowed scope
        expect(localStorage.getItem(contentScopeLocalStorageKey)).toBeNull();
        // URL should fall back to the default scope
        expect(currentPathname).toBe("/main/en");
    });

    it("should use default scope when localStorage contains 'undefined' string", async () => {
        const allowedScopes = [{ scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "EN" } }];

        // Store "undefined" string (edge case that can happen in some scenarios)
        localStorage.setItem(contentScopeLocalStorageKey, "undefined");

        const { container } = render(
            <Wrapper>
                <ContentScopeProvider values={allowedScopes} defaultValue={allowedScopes[0].scope}>
                    {/* eslint-disable-next-line @calm/react-intl/missing-formatted-message */}
                    {() => <div>Content</div>}
                </ContentScopeProvider>
            </Wrapper>,
        );

        await waitFor(() => {
            expect(container.textContent).toContain("Content");
        });

        // The "undefined" string should be left as-is since it's handled by the check
        // The provider uses the default scope instead of trying to parse "undefined"
        expect(localStorage.getItem(contentScopeLocalStorageKey)).toBe("undefined");
        // URL should use the default scope
        expect(currentPathname).toBe("/main/en");
    });
});
