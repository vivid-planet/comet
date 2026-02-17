import { createTableBlock } from "@comet/cms-admin";

import { LinkBlock } from "../blocks/LinkBlock";

export const TableBlock = createTableBlock({
    rte: {
        link: LinkBlock,
        minHeight: 0,
    },
});
