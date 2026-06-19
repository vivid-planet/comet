import { createContext, type PropsWithChildren } from "react";

import type { ScopeCopyHandler } from "./ScopeCopyHandler";

export const ScopeCopyHandlersContext = createContext<ScopeCopyHandler[]>([]);

interface Props {
    /**
     * Handlers for project-specific dependency types. A handler overrides a built-in handler
     * (e.g. the DAM file handler) with the same `dependencyType`.
     */
    handlers: ScopeCopyHandler[];
}

export function ScopeCopyHandlersProvider({ handlers, children }: PropsWithChildren<Props>) {
    return <ScopeCopyHandlersContext.Provider value={handlers}>{children}</ScopeCopyHandlersContext.Provider>;
}
