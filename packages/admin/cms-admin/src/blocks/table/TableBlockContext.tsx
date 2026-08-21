import { createContext, type ReactNode, useContext } from "react";

import type { BlockInterface, ReadOnlyRenderableAdminComponent } from "../types";

type TableBlockContextValue = {
    RichTextBlock: BlockInterface & ReadOnlyRenderableAdminComponent;
};

const TableBlockContext = createContext<TableBlockContextValue | undefined>(undefined);

export const TableBlockContextProvider = ({ RichTextBlock, children }: TableBlockContextValue & { children: ReactNode }) => (
    <TableBlockContext.Provider value={{ RichTextBlock }}>{children}</TableBlockContext.Provider>
);

export const useTableBlockContext = (): TableBlockContextValue => {
    const context = useContext(TableBlockContext);
    if (!context) {
        throw new Error("useTableBlockContext must be used within a TableBlockContextProvider");
    }
    return context;
};
