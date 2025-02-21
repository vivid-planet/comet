import { useContext } from "react";

import { PageTreeContext } from "./PageTreeContext";

export function usePageTreeContext(): PageTreeContext {
    const context = useContext(PageTreeContext);

    if (context === undefined) {
        throw new Error("PageTreeContext is undefined");
    }

    return context;
}
