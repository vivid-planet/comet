import { createContext } from "react";

/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
export interface SplitButtonContextOptions {
    setShowSelectButton: (show: boolean | undefined) => void;
}

/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
const SplitButtonContext = createContext<SplitButtonContextOptions | undefined>(undefined);
export { SplitButtonContext };
