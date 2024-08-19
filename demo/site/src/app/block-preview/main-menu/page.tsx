"use client";
import { BlockPreviewProvider, IFrameBridgeProvider, useIFrameBridge } from "@comet/cms-site";
import RichTextBlock from "@src/blocks/RichTextBlock";
import * as React from "react";

const PreviewMainMenu: React.FunctionComponent = () => {
    const iFrameBridge = useIFrameBridge();

    return <div>{iFrameBridge.block && <RichTextBlock data={iFrameBridge.block} />}</div>;
};
const IFrameBridgePreviewPage = (): JSX.Element => {
    return (
        <IFrameBridgeProvider>
            <BlockPreviewProvider>
                <PreviewMainMenu />
            </BlockPreviewProvider>
        </IFrameBridgeProvider>
    );
};

export default IFrameBridgePreviewPage;
