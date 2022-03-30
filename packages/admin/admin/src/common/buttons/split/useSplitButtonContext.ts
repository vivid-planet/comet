import * as React from "react";

import { SplitButtonContext, SplitButtonContextOptions } from "./SplitButtonContext";

export function useSplitButtonContext(): SplitButtonContextOptions | undefined {
    return React.useContext(SplitButtonContext);
}
