import { createContext, type ReactNode, useContext, useRef } from "react";
import { createBrowserRouter, RouterProvider, type RouterProviderProps } from "react-router";

import { type PromptHandlerApi, RouterPromptHandler } from "./PromptHandler";

export interface BrowserRouterProps {
    basename?: string;
    children?: ReactNode;
}

// BrowserRouter that sets up a material-ui confirmation dialog
// plus a PromptHandler that works with our Prompt (supporting multiple Prompts)

const ChildrenContext = createContext<ReactNode>(null);

function LayoutRoute() {
    const children = useContext(ChildrenContext);
    const apiRef = useRef<PromptHandlerApi>();
    return <RouterPromptHandler apiRef={apiRef}>{children}</RouterPromptHandler>;
}

export const RouterBrowserRouter = ({ children, basename }: BrowserRouterProps) => {
    const routerRef = useRef<RouterProviderProps["router"]>();
    if (!routerRef.current) {
        routerRef.current = createBrowserRouter([{ path: "*", Component: LayoutRoute }], { basename });
    }

    return (
        <ChildrenContext.Provider value={children}>
            <RouterProvider router={routerRef.current} />
        </ChildrenContext.Provider>
    );
};
