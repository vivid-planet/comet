import { createContext } from "react";

import type { BlockInterface } from "../types";

export interface ChildBlockContextValue {
    childBlocks: BlockInterface[];
    onEditChildBlock: (pos: number) => void;
    onDeleteChildBlock: (pos: number) => void;
}

export const ChildBlockContext = createContext<ChildBlockContextValue>({
    childBlocks: [],
    onEditChildBlock: () => {},
    onDeleteChildBlock: () => {},
});
