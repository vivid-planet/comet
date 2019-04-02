import * as React from "react";

export interface IDirtyHandlerApiBinding {
    isDirty: () => boolean;
    submit: () => void;
    reset: () => void;
}
export interface IDirtyHandlerApi {
    registerBinding: (cmp: React.Component, binding: IDirtyHandlerApiBinding) => void;
    unregisterBinding: (cmp: React.Component) => void;
    isBindingDirty: () => Promise<boolean>;
    resetBindings: () => Promise<void>;
    submitBindings: () => Promise<void>;
    getParent: () => IDirtyHandlerApi | undefined;
}

export default React.createContext<IDirtyHandlerApi | undefined>(undefined);
