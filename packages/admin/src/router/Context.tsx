import * as History from "history";
import * as React from "react";

import { SaveAction } from "./PromptHandler";

interface IContext {
    register: (id: string, message: (location: History.Location, action: History.Action) => string | boolean, saveAction?: SaveAction) => void;
    unregister: (id: string) => void;
}

export const RouterContext = React.createContext<IContext | undefined>(undefined);
