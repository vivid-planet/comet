import { RowActionsItem } from "@comet/admin";
import { Copy, Paste } from "@comet/admin-icons";
import React from "react";
import { FormattedMessage } from "react-intl";

import { subTreeFromNode, treeMapToArray } from "./treemap/TreeMapUtils";
import { useCopyPastePages } from "./useCopyPastePages";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface Props {
    page: PageTreePage;
}

export const CopyPasteMenuItem = ({ page }: Props): React.ReactElement => {
    const { prepareForClipboard, writeToClipboard, getFromClipboard, sendPages, progressDialog } = useCopyPastePages();
    const { tree } = usePageTreeContext();

    return (
        <>
            {progressDialog}
            <RowActionsItem
                icon={<Copy />}
                onClick={async () => {
                    const subTree = subTreeFromNode(page, tree);
                    const pagesAsArray = treeMapToArray(subTree, "root");
                    const pagesClipboard = await prepareForClipboard(pagesAsArray);
                    await writeToClipboard(pagesClipboard);
                }}
            >
                <FormattedMessage id="comet.pages.pages.page.copy" defaultMessage="Copy" />
            </RowActionsItem>
            <RowActionsItem
                icon={<Paste />}
                onClick={async () => {
                    const pages = await getFromClipboard();
                    if (pages.canPaste) {
                        await sendPages(page.parentId, pages.content, { targetPos: page.pos + 1 });
                    }
                }}
            >
                <FormattedMessage id="comet.pages.pages.page.paste" defaultMessage="Paste" />
            </RowActionsItem>
            <RowActionsItem
                icon={<Copy />}
                onClick={async () => {
                    const subTree = subTreeFromNode(page, tree);
                    const pagesAsArray = treeMapToArray(subTree, "root");
                    const pages = await prepareForClipboard(pagesAsArray);
                    await sendPages(page.parentId, pages, { targetPos: page.pos + 1 });
                }}
            >
                <FormattedMessage id="comet.pageTree.duplicate" defaultMessage="Duplicate" />
            </RowActionsItem>
        </>
    );
};
