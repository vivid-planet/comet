import * as React from "react";

import { BuildInformation, BuildInformationContext } from "./BuildInformationContext";

export function useBuildInformation(): BuildInformation | undefined {
    return React.useContext(BuildInformationContext);
}
