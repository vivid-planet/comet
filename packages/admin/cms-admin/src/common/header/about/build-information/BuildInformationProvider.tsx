import * as React from "react";

import { BuildInformation, BuildInformationContext } from "./BuildInformationContext";

interface Props {
    children: React.ReactNode;
    value: BuildInformation;
}

export const BuildInformationProvider = ({ children, value }: Props): React.ReactElement => {
    return <BuildInformationContext.Provider value={value}>{children}</BuildInformationContext.Provider>;
};
