import * as React from "react";

import { SplitButtonContext, SplitButtonContextOptions } from "./SplitButtonContext";

/**
 * @deprecated Use a simple `SaveButton` instead as we are retiring the SplitButton pattern.
 */
export function useSplitButtonContext(): SplitButtonContextOptions | undefined {
    return React.useContext(SplitButtonContext);
}
