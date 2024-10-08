import { BlockPreviewProvider, IFrameBridgeProvider, useIFrameBridge } from "@comet/cms-site";
import { PageContentBlock } from "@src/blocks/PageContentBlock";

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
