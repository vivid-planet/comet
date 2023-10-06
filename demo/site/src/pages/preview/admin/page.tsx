import { BlockPreviewProvider, IFrameBridgeProvider, useIFrameBridge } from "@comet/cms-site";
import { recursivelyLoadBlockData } from "@src/blockRegistry";
import { PageContentBlockData } from "@src/blocks.generated";
import { PageContentBlock } from "@src/blocks/PageContentBlock";
import createGraphQLClient from "@src/util/createGraphQLClient";
import * as React from "react";

const PreviewPage: React.FunctionComponent = () => {
    const iFrameBridge = useIFrameBridge();
    const clientRef = React.useRef(
        createGraphQLClient({
            previewDamUrls: true,
            includeInvisibleBlocks: false,
            includeInvisiblePages: false,
        }),
    );
    const [blockData, setBlockData] = React.useState<PageContentBlockData>();
    React.useEffect(() => {
        async function load() {
            if (!iFrameBridge.block) {
                setBlockData(undefined);
                return;
            }
            console.log("loading block data", iFrameBridge.block);
            const newData = await recursivelyLoadBlockData({ blockType: "PageContent", blockData: iFrameBridge.block, client: clientRef.current });
            setBlockData(newData);
            console.log("loaded block data", newData);
        }
        load();
    }, [iFrameBridge.block]);

    return <div>{blockData && <PageContentBlock data={blockData} />}</div>;
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
