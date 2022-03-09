import * as React from "react";

import { SubmitResult } from "./form/SubmitResult";

export interface IDirtyHandlerApiBinding {
    isDirty: () => boolean;
    submit: () => Promise<SubmitResult | void>;
    reset: () => void;
}
export interface IDirtyHandlerApi {
    registerBinding: (cmp: React.MutableRefObject<IDirtyHandlerApiBinding | undefined>, binding: IDirtyHandlerApiBinding) => void;
    unregisterBinding: (cmp: React.MutableRefObject<IDirtyHandlerApiBinding | undefined>) => void;
    isBindingDirty: () => Promise<boolean>;
    resetBindings: () => Promise<void>;
    submitBindings: () => Promise<Array<SubmitResult>>;
    getParent: () => IDirtyHandlerApi | undefined;
}

export const DirtyHandlerApiContext = React.createContext<IDirtyHandlerApi | undefined>(undefined);
export function useDirtyHandlerApi(): IDirtyHandlerApi | undefined {
    return React.useContext(DirtyHandlerApiContext);
}
