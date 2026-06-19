import { useContext, useMemo } from "react";

import { useDamFileScopeCopyHandler } from "../../dam/scopeCopy/useDamFileScopeCopyHandler";
import type { ScopeCopyHandler } from "./ScopeCopyHandler";
import { ScopeCopyHandlersContext } from "./ScopeCopyHandlersContext";

/**
 * Returns the scope copy handlers to use for a scope-crossing copy: the built-in handlers (e.g. the
 * DAM file handler) merged with the project handlers from {@link ScopeCopyHandlersContext}. A project
 * handler overrides a built-in handler with the same `dependencyType`.
 */
export function useScopeCopyHandlers(): ScopeCopyHandler[] {
    const damFileScopeCopyHandler = useDamFileScopeCopyHandler();
    const projectHandlers = useContext(ScopeCopyHandlersContext);

    return useMemo(() => {
        const builtInHandlers: ScopeCopyHandler[] = [damFileScopeCopyHandler];
        const overriddenTypes = new Set(projectHandlers.map((handler) => handler.dependencyType));

        return [...builtInHandlers.filter((handler) => !overriddenTypes.has(handler.dependencyType)), ...projectHandlers];
    }, [damFileScopeCopyHandler, projectHandlers]);
}
