import { createContext } from "react";

export type LabelsContextType = {
    permissionLabels?: Record<string, React.ReactNode>;
};
export const LabelsContext = createContext<LabelsContextType>({});
