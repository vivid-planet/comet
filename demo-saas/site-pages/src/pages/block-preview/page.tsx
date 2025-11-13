import { BlockPreviewProvider, IFrameBridgeProvider, useIFrameBridge } from "@comet/site-nextjs";
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";

const PreviewPage = () => {
    const iFrameBridge = useIFrameBridge();
    return <div>{iFrameBridge.block && <PageContentBlock data={iFrameBridge.block} />}</div>;
};

const IFrameBridgePreviewPage = (): JSX.Element => {
    return (
        <IFrameBridgeProvider>
            <BlockPreviewProvider>
                <PreviewPage />
            </BlockPreviewProvider>
        </IFrameBridgeProvider>
    );
};

export default IFrameBridgePreviewPage;
