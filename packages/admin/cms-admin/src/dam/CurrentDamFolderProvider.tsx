import { createContext, type PropsWithChildren, useContext } from "react";

type CurrentDamFolderApi = {
    folderId: string | undefined;
};

const CurrentDamFolderContext = createContext<CurrentDamFolderApi>({ folderId: undefined });

export function useCurrentDamFolder(): CurrentDamFolderApi {
    const context = useContext(CurrentDamFolderContext);
    if (!context) {
        throw new Error("useCurrentDamFolder() must be used within a CurrentDamFolderProvider");
    }
    return context;
}

export function CurrentDamFolderProvider({ folderId, children }: PropsWithChildren<{ folderId: CurrentDamFolderApi["folderId"] }>) {
    return <CurrentDamFolderContext.Provider value={{ folderId }}>{children}</CurrentDamFolderContext.Provider>;
}
