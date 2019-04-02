import * as React from "react";

interface IContext {
    register: (id: string, message: () => string | boolean) => void;
    unregister: (id: string) => void;
}
export default React.createContext<IContext | undefined>(undefined);
