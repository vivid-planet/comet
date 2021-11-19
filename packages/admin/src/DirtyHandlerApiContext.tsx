import { Location } from "history";
import * as React from "react";

import { SubmitResult } from "./form/SubmitResult";

export interface IDirtyHandlerApiBinding {
    isDirty: (location?: Location) => boolean;
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
