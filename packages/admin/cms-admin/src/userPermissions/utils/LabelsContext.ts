import React from "react";

export type LabelsContextType = {
    permissionLabels?: Record<string, React.ReactNode>;
};
export const LabelsContext = React.createContext<LabelsContextType>({});
