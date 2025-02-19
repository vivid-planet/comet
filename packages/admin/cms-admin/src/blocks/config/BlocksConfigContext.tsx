import { createContext, type PropsWithChildren, useContext } from "react";

import { type ContentScopeInterface } from "../../contentScope/Provider";

export type BlocksConfig = {
    supportsBlock?: (name: string, scope: ContentScopeInterface) => boolean;
};

const BlocksConfigContext = createContext<BlocksConfig>({});

export function useBlocksConfig() {
    return useContext(BlocksConfigContext);
}

export function BlocksConfigProvider({ children, ...value }: PropsWithChildren<BlocksConfig>) {
    return <BlocksConfigContext.Provider value={value}>{children}</BlocksConfigContext.Provider>;
}
