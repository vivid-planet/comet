import { type BlockInterface, createBlockSkeleton } from "@comet/cms-admin";
import { type PageTreeIndexBlockData, type PageTreeIndexBlockInput } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

export const PageTreeIndexBlock: BlockInterface<PageTreeIndexBlockData, Record<string, never>, PageTreeIndexBlockInput> = {
    ...createBlockSkeleton(),
    name: "PageTreeIndex",
    displayName: <FormattedMessage id="blocks.pageTreeIndex" defaultMessage="Page Tree Index" />,
    defaultValues: () => ({}),
};
