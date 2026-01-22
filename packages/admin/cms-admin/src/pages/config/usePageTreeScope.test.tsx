import { MockedProvider } from "@apollo/client/testing";
import { RouterMemoryRouter } from "@comet/admin";
import { renderHook } from "@testing-library/react";
import { type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { type CometConfig, CometConfigProvider } from "../../config/CometConfigContext";
import { ContentScopeProvider } from "../../contentScope/Provider";
import { CurrentUserContext } from "../../userPermissions/hooks/currentUser";
import { type PageTreeConfig } from "../pageTreeConfig";
import { usePageTreeScope } from "./usePageTreeScope";

describe("usePageTreeScope", () => {
    function Providers({ children }: { children: ReactNode }) {
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
                        <ContentScopeProvider
                            values={[{ scope: { domain: "main", language: "en" } }]}
                            defaultValue={{ domain: "main", language: "en" }}
                        >
                            {() => <>{children}</>}
                        </ContentScopeProvider>
                    </RouterMemoryRouter>
                </CurrentUserContext.Provider>
            </MockedProvider>
        );
    }

    const baseCometConfig = {} as CometConfig;
    const basePageTreeConfig = {} as PageTreeConfig;

    it("should work with CmsBlockContextProvider", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CometConfigProvider {...baseCometConfig}>{children}</CometConfigProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({ domain: "main", language: "en" });
    });

    it("should work for a single dimension", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CometConfigProvider {...baseCometConfig} pageTree={{ ...basePageTreeConfig, scopeParts: ["domain"] }}>
                        {children}
                    </CometConfigProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({ domain: "main" });
    });

    it("should work for multiple dimensions", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CometConfigProvider {...baseCometConfig} pageTree={{ ...basePageTreeConfig, scopeParts: ["domain", "language"] }}>
                        {children}
                    </CometConfigProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({ domain: "main", language: "en" });
    });

    it("should work for no dimensions", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CometConfigProvider {...baseCometConfig} pageTree={{ ...basePageTreeConfig, scopeParts: [] }}>
                        {children}
                    </CometConfigProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({});
    });

    it("should ignore unknown dimensions", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CometConfigProvider {...baseCometConfig} pageTree={{ ...basePageTreeConfig, scopeParts: ["domain", "unknown"] }}>
                        {children}
                    </CometConfigProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({ domain: "main" });
    });
});
