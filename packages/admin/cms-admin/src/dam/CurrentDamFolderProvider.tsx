import * as React from "react";

type CurrentDamFolderContext = {
    folderId: string | undefined;
};

const FolderContext = React.createContext<CurrentDamFolderContext>({ folderId: undefined });

export function useCurrentDamFolder(): CurrentDamFolderContext {
    const context = React.useContext(FolderContext);
    if (!context) {
        throw new Error("useFolderContext must be used within a FolderContextProvider");
    }
    return context;
}

export function CurrentDamFolderProvider({
    folderId,
    children,
}: {
    folderId: CurrentDamFolderContext["folderId"];
    children: React.ReactNode;
}): React.ReactElement {
    return <FolderContext.Provider value={{ folderId }}>{children}</FolderContext.Provider>;
}
