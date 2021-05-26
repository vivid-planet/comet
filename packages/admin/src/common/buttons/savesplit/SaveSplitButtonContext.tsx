import * as React from "react";

export interface SaveSplitButtonContextOptions {
    setDisabled: (disabled: boolean | undefined) => void;
    setShowSelectButton: (show: boolean | undefined) => void;
}

const SaveSplitButtonContext = React.createContext<SaveSplitButtonContextOptions | undefined>(undefined);
export { SaveSplitButtonContext };
