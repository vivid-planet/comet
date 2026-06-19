import { useContext } from "react";

import type { ScopeCopyHandler } from "./ScopeCopyHandler";
import { ScopeCopyHandlersContext } from "./ScopeCopyHandlersContext";

/**
 * Returns the scope copy handlers to use for a scope-crossing copy: the built-in handlers merged
 * with the project handlers from {@link ScopeCopyHandlersContext}. A project handler overrides a
 * built-in handler with the same `dependencyType`.
 */
export function useScopeCopyHandlers(): ScopeCopyHandler[] {
    return useContext(ScopeCopyHandlersContext);
}
