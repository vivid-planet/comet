import { createContext, type ReactNode, useContext } from "react";

import type { RichTextBlock } from "../createRichTextBlock";

type TableBlockContextValue = {
    RichTextBlock: RichTextBlock;
};

const TableBlockContext = createContext<TableBlockContextValue | undefined>(undefined);

export const TableBlockContextProvider = ({ RichTextBlock, children }: TableBlockContextValue & { children: ReactNode }) => (
    <TableBlockContext.Provider value={{ RichTextBlock }}>{children}</TableBlockContext.Provider>
);

export const useTableBlockContext = (): TableBlockContextValue => {
    const context = useContext(TableBlockContext);
    if (!context) throw new Error("useTableBlockContext must be used within a TableBlockContextProvider");
    return context;
};
