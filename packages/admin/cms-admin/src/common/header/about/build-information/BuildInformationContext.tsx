import { createContext } from "react";

export interface BuildInformation {
    date: string;
    commitHash: string;
    number: string;
}

export const BuildInformationContext = createContext<BuildInformation | undefined>(undefined);
