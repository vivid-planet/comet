import * as React from "react";

export interface MlServiceContext {
    enabled: boolean;
}

export const MlServiceContext = React.createContext<MlServiceContext>({
    enabled: false,
});
