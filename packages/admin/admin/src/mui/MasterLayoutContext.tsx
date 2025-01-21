import { createContext } from "react";

interface MasterLayoutContextValues {
    headerHeight: number;
}

export const MasterLayoutContext = createContext<MasterLayoutContextValues>({
    headerHeight: 0,
});
