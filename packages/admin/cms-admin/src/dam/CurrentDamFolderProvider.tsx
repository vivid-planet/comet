import * as React from "react";

type CurrentDamFolderApi = {
    folderId: string | undefined;
};

const CurrentDamFolderContext = React.createContext<CurrentDamFolderApi>({ folderId: undefined });

export function useCurrentDamFolder(): CurrentDamFolderApi {
    const context = React.useContext(CurrentDamFolderContext);
    if (!context) {
        throw new Error("useCurrentDamFolder() must be used within a CurrentDamFolderProvider");
    }
    return context;
}

export function CurrentDamFolderProvider({
    folderId,
    children,
}: {
    folderId: CurrentDamFolderApi["folderId"];
    children: React.ReactNode;
}): React.ReactElement {
    return <CurrentDamFolderContext.Provider value={{ folderId }}>{children}</CurrentDamFolderContext.Provider>;
}
