import { useContext } from "react";

import { SplitButtonContext, type SplitButtonContextOptions } from "./SplitButtonContext";

/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
export function useSplitButtonContext(): SplitButtonContextOptions | undefined {
    return useContext(SplitButtonContext);
}
