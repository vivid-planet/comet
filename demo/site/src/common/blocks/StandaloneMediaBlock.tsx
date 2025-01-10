import { PropsWithData } from "@comet/cms-site";
import { StandaloneMediaBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";

import { MediaBlock } from "./MediaBlock";

export const StandaloneMediaBlock = ({ data: { media, aspectRatio } }: PropsWithData<StandaloneMediaBlockData>) => {
    return (
        <PageLayout>
            <MediaBlock data={media} aspectRatio={aspectRatio} />
        </PageLayout>
    );
};

//export default withPreview(StandaloneMediaBlock, { label: "Media" });
