import * as React from "react";

export interface MasterLayoutContextValues {
    headerHeight: number;
}

export const MasterLayoutContext = React.createContext<MasterLayoutContextValues>({
    headerHeight: 0,
});
