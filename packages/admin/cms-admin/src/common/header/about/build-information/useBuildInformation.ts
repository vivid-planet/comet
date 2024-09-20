import { useContext } from "react";

import { BuildInformation, BuildInformationContext } from "./BuildInformationContext";

export function useBuildInformation(): BuildInformation | undefined {
    return useContext(BuildInformationContext);
}
