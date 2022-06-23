import * as React from "react";

import { BlockContext } from "./BlockContext";

export function useBlockContext(): unknown {
    return React.useContext(BlockContext);
}
