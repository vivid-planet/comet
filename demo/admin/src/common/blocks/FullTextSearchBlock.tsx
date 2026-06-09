import { type BlockInterface, createBlockSkeleton } from "@comet/cms-admin";
import type { FullTextSearchBlockData, FullTextSearchBlockInput } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

export const FullTextSearchBlock: BlockInterface<FullTextSearchBlockData, Record<string, never>, FullTextSearchBlockInput> = {
    ...createBlockSkeleton(),
    name: "FullTextSearch",
    displayName: <FormattedMessage id="blocks.fullTextSearch" defaultMessage="Full Text Search" />,
    defaultValues: () => ({}),
};
