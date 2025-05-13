import { ListBlock, PropsWithData, withPreview } from "@comet/site-next";
import { LinkListBlockData } from "@src/blocks.generated";

import { TextLinkBlock } from "./TextLinkBlock";

export const LinkListBlock = withPreview(
    ({ data }: PropsWithData<LinkListBlockData>) => {
        return <ListBlock data={data} block={(props) => <TextLinkBlock data={props} />} />;
    },
    { label: "Link list" },
);
