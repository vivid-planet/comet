import * as React from "react";

import { PageTreeContext } from "./PageTreeContext";

export function usePageTreeContext(): PageTreeContext {
    const context = React.useContext(PageTreeContext);

    if (context === undefined) {
        throw new Error("PageTreeContext is undefined");
    }

    return context;
}
