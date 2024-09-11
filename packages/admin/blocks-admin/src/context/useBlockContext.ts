import { useContext } from "react";

import { BlockContext } from "./BlockContext";

export function useBlockContext() {
    return useContext(BlockContext);
}
