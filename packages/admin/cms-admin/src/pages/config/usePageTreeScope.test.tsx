import { MockedProvider } from "@apollo/client/testing";
import { RouterMemoryRouter } from "@comet/admin";
import { renderHook } from "@testing-library/react-hooks";
import { ReactNode } from "react";

import { CmsBlockContext, CmsBlockContextProvider } from "../../blocks/CmsBlockContextProvider";
import { ContentScopeProvider } from "../../contentScope/Provider";
import { usePageTreeScope } from "./usePageTreeScope";

describe("usePageTreeScope", () => {
    function Providers({ children }: { children: ReactNode }) {
        return (
            <MockedProvider>
                <RouterMemoryRouter>
                    <ContentScopeProvider
                        values={[{ domain: { value: "main" }, language: { value: "en" } }]}
                        defaultValue={{ domain: "main", language: "en" }}
                    >
                        {() => <>{children}</>}
                    </ContentScopeProvider>
                </RouterMemoryRouter>
            </MockedProvider>
        );
    }

    const baseCmsBlockContext = {} as CmsBlockContext;

    it("should work without CmsBlockContextProvider", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => <Providers>{children}</Providers>,
        });

        expect(result.current).toEqual({ domain: "main", language: "en" });
    });

    it("should work with CmsBlockContextProvider", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CmsBlockContextProvider {...baseCmsBlockContext}>{children}</CmsBlockContextProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({ domain: "main", language: "en" });
    });

    it("should work for a single dimension", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CmsBlockContextProvider {...baseCmsBlockContext} pageTreeScopeParts={["domain"]}>
                        {children}
                    </CmsBlockContextProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({ domain: "main" });
    });

    it("should work for multiple dimensions", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CmsBlockContextProvider {...baseCmsBlockContext} pageTreeScopeParts={["domain", "language"]}>
                        {children}
                    </CmsBlockContextProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({ domain: "main", language: "en" });
    });

    it("should work for no dimensions", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CmsBlockContextProvider {...baseCmsBlockContext} pageTreeScopeParts={[]}>
                        {children}
                    </CmsBlockContextProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({});
    });

    it("should ignore unknown dimensions", () => {
        const { result } = renderHook(() => usePageTreeScope(), {
            wrapper: ({ children }) => (
                <Providers>
                    <CmsBlockContextProvider {...baseCmsBlockContext} pageTreeScopeParts={["domain", "unknown"]}>
                        {children}
                    </CmsBlockContextProvider>
                </Providers>
            ),
        });

        expect(result.current).toEqual({ domain: "main" });
    });
});
