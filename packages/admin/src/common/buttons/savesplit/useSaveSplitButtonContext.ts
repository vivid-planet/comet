import * as React from "react";

import { SaveSplitButtonContext, SaveSplitButtonContextOptions } from "./SaveSplitButtonContext";

export function useSaveSplitButtonContext(): SaveSplitButtonContextOptions | undefined {
    return React.useContext(SaveSplitButtonContext);
}
