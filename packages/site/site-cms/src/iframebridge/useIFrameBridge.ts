import * as React from "react";

import { IFrameBridgeContext } from "./IFrameBridge";

export function useIFrameBridge(): IFrameBridgeContext {
    return React.useContext(IFrameBridgeContext);
}
