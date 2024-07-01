import React from "react";

export type LabelsContextType = {
    permissionLabels?: Record<string, React.ReactNode>;
    contentScopeLabels?: Array<{
        contentScope: Record<string, string>;
        label: string;
    }>;
};
export const LabelsContext = React.createContext<LabelsContextType>({});
