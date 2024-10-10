import { AdminComponentPart, AdminTabs, IFrameBridgeProvider } from "@comet/blocks-admin";

import { BlockPreviewWithTabsContext } from "./BlockPreviewWithTabsContext";
import { SplitPreview } from "./SplitPreview";
import { BlockPreviewApi } from "./useBlockPreview";

interface Props {
    previewApi: BlockPreviewApi;
    children: AdminComponentPart[];
    previewState: unknown;
    previewUrl: string;
}

function BlockPreviewWithTabs({ children, previewApi, previewState, previewUrl }: Props) {
    let pageContent = null;

    if (previewApi.minimized) {
        const [firstTab, ...otherTabs] = children;

        pageContent = [firstTab.content, <AdminTabs key="1">{otherTabs}</AdminTabs>];
    } else {
        pageContent = <AdminTabs>{children}</AdminTabs>;
    }

    return (
        <BlockPreviewWithTabsContext.Provider value={{ previewState, previewApi }}>
            <IFrameBridgeProvider key={previewUrl}>
                <SplitPreview url={previewUrl} previewState={previewState} previewApi={previewApi}>
                    {pageContent}
                </SplitPreview>
            </IFrameBridgeProvider>
        </BlockPreviewWithTabsContext.Provider>
    );
}

export { BlockPreviewWithTabs };
