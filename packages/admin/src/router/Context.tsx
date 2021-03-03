import * as History from "history";
import * as React from "react";

interface IContext {
    register: (id: string, message: (location: History.Location, action: History.Action) => string | boolean) => void;
    unregister: (id: string) => void;
}

export const RouterContext = React.createContext<IContext | undefined>(undefined);
