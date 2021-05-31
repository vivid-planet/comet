import * as React from "react";

export interface SplitButtonContextOptions {
    setShowSelectButton: (show: boolean | undefined) => void;
}

const SplitButtonContext = React.createContext<SplitButtonContextOptions | undefined>(undefined);
export { SplitButtonContext };
