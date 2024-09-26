import { PropsWithChildren } from "react";

import { BuildInformation, BuildInformationContext } from "./BuildInformationContext";

interface Props {
    value: BuildInformation;
}

export const BuildInformationProvider = ({ children, value }: PropsWithChildren<Props>) => {
    return <BuildInformationContext.Provider value={value}>{children}</BuildInformationContext.Provider>;
};
