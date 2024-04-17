import * as History from "history";
import * as React from "react";

import { PromptRoutes } from "./Prompt";
import { SaveAction } from "./PromptHandler";

interface IContext {
    register: (options: {
        id: string;
        message: (location: History.Location, action: History.Action) => string | boolean;
        saveAction?: SaveAction;
        path: string;
        subRoutePath?: string;
        promptRoutes?: React.MutableRefObject<PromptRoutes>;
    }) => void;
    unregister: (id: string) => void;
}

export const RouterContext = React.createContext<IContext | undefined>(undefined);
