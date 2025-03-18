import { createContext, type ReactNode } from "react";

export type LabelsContextType = {
    permissionLabels?: Record<string, ReactNode>;
};
export const LabelsContext = createContext<LabelsContextType>({});
