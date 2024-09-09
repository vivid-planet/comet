import { createContext } from "react";

export interface MasterLayoutContextValues {
    headerHeight: number;
}

export const MasterLayoutContext = createContext<MasterLayoutContextValues>({
    headerHeight: 0,
});
