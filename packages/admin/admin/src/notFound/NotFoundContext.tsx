import { createContext, type ReactNode, useContext } from "react";

const NotFoundContext = createContext<ReactNode>(null);

export function NotFoundProvider({ notFound, children }: { notFound: ReactNode; children: ReactNode }) {
    return <NotFoundContext.Provider value={notFound}>{children}</NotFoundContext.Provider>;
}

export function useNotFound(): ReactNode {
    return useContext(NotFoundContext);
}
