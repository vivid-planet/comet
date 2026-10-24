import { type BlockInterface, createBlockSkeleton } from "@dextinity/cms-admin";
import { FormattedMessage } from "react-intl";

export const PageTreeIndexBlock: BlockInterface<Record<string, never>, Record<string, never>, Record<string, never>> = {
    ...createBlockSkeleton(),
    name: "PageTreeIndex",
    displayName: <FormattedMessage id="blocks.pageTreeIndex" defaultMessage="Page Tree Index" />,
    defaultValues: () => ({}),
};
