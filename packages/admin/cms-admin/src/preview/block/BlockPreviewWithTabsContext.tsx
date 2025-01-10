import { createContext, useContext } from "react";

import { BlockPreviewApi } from "./useBlockPreview";

export interface BlockPreviewWithTabsApi {
    previewState: unknown;
    previewApi: BlockPreviewApi;
}

export const BlockPreviewWithTabsContext = createContext<BlockPreviewWithTabsApi | undefined>(undefined);

export const useBlockPreviewWithTabsContext = () => {
    return useContext(BlockPreviewWithTabsContext);
};
