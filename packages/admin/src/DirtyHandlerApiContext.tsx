import * as React from "react";

import { SubmitResult } from "./form/SubmitResult";

export interface IDirtyHandlerApiBinding {
    isDirty: (state: unknown) => boolean; // state might contain data which could be relevant for the isDirty-state
    submit: () => Promise<SubmitResult | void>;
    reset: () => void;
}
export interface IDirtyHandlerApi {
    registerBinding: (cmp: object, binding: IDirtyHandlerApiBinding) => void;
    unregisterBinding: (cmp: object) => void;
    isBindingDirty: () => Promise<boolean>;
    resetBindings: () => Promise<void>;
    submitBindings: () => Promise<Array<SubmitResult>>;
    getParent: () => IDirtyHandlerApi | undefined;
}

export const DirtyHandlerApiContext = React.createContext<IDirtyHandlerApi | undefined>(undefined);
export function useDirtyHandlerApi() {
    return React.useContext(DirtyHandlerApiContext);
}
