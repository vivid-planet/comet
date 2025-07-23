import type * as History from "history";
import { createContext, type MutableRefObject } from "react";

import { type PromptRoutes } from "./Prompt";
import { type ResetAction, type SaveAction } from "./PromptHandler";

interface IContext {
    register: (options: {
        id: string;
        message: (location: History.Location, action: History.Action) => string | boolean;
        saveAction?: SaveAction;
        resetAction?: ResetAction;
        path: string;
        subRoutePath?: string;
        promptRoutes?: MutableRefObject<PromptRoutes>;
    }) => void;
    unregister: (id: string) => void;
}

export const RouterContext = createContext<IContext | undefined>(undefined);
