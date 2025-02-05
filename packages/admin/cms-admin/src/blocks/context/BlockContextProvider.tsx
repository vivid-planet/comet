import { type PropsWithChildren } from "react";

import { BlockContext } from "./BlockContext";

interface Props {
    value: unknown;
}

export const BlockContextProvider = ({ value, children }: PropsWithChildren<Props>) => {
    return <BlockContext.Provider value={value}>{children}</BlockContext.Provider>;
};
