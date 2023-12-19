import * as React from "react";

type CurrentDamFolderContext = {
    folderId: string | undefined;
};

const CurrentDamFolderContext = React.createContext<CurrentDamFolderContext>({ folderId: undefined });

export function useCurrentDamFolder(): CurrentDamFolderContext {
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
    folderId: CurrentDamFolderContext["folderId"];
    children: React.ReactNode;
}): React.ReactElement {
    return <CurrentDamFolderContext.Provider value={{ folderId }}>{children}</CurrentDamFolderContext.Provider>;
}
