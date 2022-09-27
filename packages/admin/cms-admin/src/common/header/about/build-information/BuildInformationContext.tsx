import * as React from "react";

export interface BuildInformation {
    date: string;
    commitHash: string;
    number: string;
}

export const BuildInformationContext = React.createContext<BuildInformation | undefined>(undefined);
