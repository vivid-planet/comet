import { createContext, type PropsWithChildren, useContext } from "react";

import { type ContentScopeInterface } from "../../contentScope/Provider";

export type BlocksConfig = {
    /**
     * Check if a block is supported in the current scope.
     *
     * @param {string} name The name of the block.
     * @param scope The current content scope.
     * @returns {boolean} True if the block is supported in the current scope.
     */
    isBlockSupported?: (name: string, scope: ContentScopeInterface) => boolean;
};

const BlocksConfigContext = createContext<BlocksConfig>({});

export function useBlocksConfig() {
    return useContext(BlocksConfigContext);
}

export function BlocksConfigProvider({ children, ...value }: PropsWithChildren<BlocksConfig>) {
    return <BlocksConfigContext.Provider value={value}>{children}</BlocksConfigContext.Provider>;
}
