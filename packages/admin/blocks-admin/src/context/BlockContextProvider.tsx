import * as React from "react";

import { BlockContext } from "./BlockContext";

interface Props {
    value: unknown;
    children: React.ReactNode;
}

export function BlockContextProvider({ value, children }: Props): React.ReactElement {
    return <BlockContext.Provider value={value}>{children}</BlockContext.Provider>;
}
