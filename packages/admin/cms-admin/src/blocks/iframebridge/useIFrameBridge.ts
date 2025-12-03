import { useContext } from "react";

import { IFrameBridgeContext } from "./IFrameBridge";

export function useIFrameBridge(): IFrameBridgeContext {
    return useContext(IFrameBridgeContext);
}
