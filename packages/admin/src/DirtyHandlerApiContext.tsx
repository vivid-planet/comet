import * as React from "react";

export interface IDirtyHandlerApiBinding {
    isDirty: () => boolean;
    submit: () => Promise<unknown>;
    reset: () => void;
}
export interface IDirtyHandlerApi {
    registerBinding: (cmp: object, binding: IDirtyHandlerApiBinding) => void;
    unregisterBinding: (cmp: object) => void;
    isBindingDirty: () => Promise<boolean>;
    resetBindings: () => Promise<void>;
    submitBindings: () => Promise<void>;
    getParent: () => IDirtyHandlerApi | undefined;
}

export const DirtyHandlerApiContext = React.createContext<IDirtyHandlerApi | undefined>(undefined);
export function useDirtyHandlerApi() {
    return React.useContext(DirtyHandlerApiContext);
}
