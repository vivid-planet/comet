import { createContext, type ReactNode, useContext, useRef } from "react";
import { createMemoryRouter, RouterProvider, type RouterProviderProps } from "react-router";

import { type PromptHandlerApi, RouterPromptHandler } from "./PromptHandler";

export interface MemoryRouterProps {
    initialEntries?: string[];
    initialIndex?: number;
    children?: ReactNode;
}

// MemoryRouter that sets up a material-ui confirmation dialog
// plus a PromptHandler that works with our Prompt (supporting multiple Prompts)

const ChildrenContext = createContext<ReactNode>(null);

function LayoutRoute() {
    const children = useContext(ChildrenContext);
    const apiRef = useRef<PromptHandlerApi>();
    return <RouterPromptHandler apiRef={apiRef}>{children}</RouterPromptHandler>;
}

export const RouterMemoryRouter = ({ children, initialEntries, initialIndex }: MemoryRouterProps) => {
    const routerRef = useRef<RouterProviderProps["router"]>();
    if (!routerRef.current) {
        routerRef.current = createMemoryRouter([{ path: "*", Component: LayoutRoute }], { initialEntries, initialIndex });
    }

    return (
        <ChildrenContext.Provider value={children}>
            <RouterProvider router={routerRef.current} />
        </ChildrenContext.Provider>
    );
};
