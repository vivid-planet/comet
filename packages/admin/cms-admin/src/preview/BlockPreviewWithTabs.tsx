import { AdminComponentPart, AdminTabs, IFrameBridgeProvider } from "@comet/blocks-admin";
import * as React from "react";

import { SplitPreview } from "./SplitPreview";
import { BlockPreviewApi } from "./useBlockPreview";

interface Props {
    previewApi: BlockPreviewApi;
    children: AdminComponentPart[];
    previewState: unknown;
    previewUrl: string;
}

function BlockPreviewWithTabs({ children, previewApi, previewState, previewUrl }: Props): React.ReactElement {
    let pageContent = null;

    if (previewApi.minimized) {
        const [firstTab, ...otherTabs] = children;

        pageContent = [firstTab.content, <AdminTabs key="1">{otherTabs}</AdminTabs>];
    } else {
        pageContent = <AdminTabs>{children}</AdminTabs>;
    }

    return (
        <IFrameBridgeProvider key={previewUrl}>
            <SplitPreview url={previewUrl} previewState={previewState} previewApi={previewApi}>
                {pageContent}
            </SplitPreview>
        </IFrameBridgeProvider>
    );
}

export { BlockPreviewWithTabs };
