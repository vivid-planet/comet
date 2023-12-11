import * as React from "react";

type FolderContextType = {
    folderId: string | undefined;
};

const FolderContext = React.createContext<FolderContextType>({ folderId: undefined });

export function useCurrentDamFolder(): FolderContextType {
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
    folderId: FolderContextType["folderId"];
    children: React.ReactNode;
}): React.ReactElement {
    return <FolderContext.Provider value={{ folderId }}>{children}</FolderContext.Provider>;
}
