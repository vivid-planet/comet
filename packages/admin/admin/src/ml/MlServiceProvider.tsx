import * as React from "react";

import { MlServiceContext } from "./MlServiceContext";

export const MlServiceProvider: React.FunctionComponent<MlServiceContext> = ({ children, enabled }) => {
    return <MlServiceContext.Provider value={{ enabled }}>{children}</MlServiceContext.Provider>;
};
