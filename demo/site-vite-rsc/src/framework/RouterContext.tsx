"use client";
import type { PredefinedPage } from "@src/util/predefinedPages";
import { createContext, use } from "react";

type RouterContext = {
    path: string;
    language: string;
    predefinedPages: PredefinedPage[];
};
export const RouterContext = createContext<RouterContext | undefined>(undefined);
export function RouterProvider({ value, children }: { value: RouterContext; children: React.ReactNode }) {
    return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
export function usePathname() {
    const routerContext = useRouterContext();
    return `/${routerContext.language}${routerContext.path}`;
}
export function useRouterContext() {
    const routerContext = use(RouterContext);
    if (!routerContext) throw new Error("RouterContext is not provided");
    return routerContext;
}
