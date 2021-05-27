import * as React from "react";

import { SplitButtonContext, SplitButtonContextOptions } from "./SplitButtonContext";

export function useSplitButton(): SplitButtonContextOptions | undefined {
    return React.useContext(SplitButtonContext);
}
