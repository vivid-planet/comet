import { useContext } from "react";

import { type BuildInformation, BuildInformationContext } from "./BuildInformationContext";

export function useBuildInformation(): BuildInformation | undefined {
    return useContext(BuildInformationContext);
}
