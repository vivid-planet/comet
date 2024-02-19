import * as React from "react";

import { MlServiceContext } from "./MlServiceContext";

export function useMlService(): MlServiceContext {
    return React.useContext(MlServiceContext);
}
