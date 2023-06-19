import { RowActionsItem } from "@comet/admin";
import { ArrowLeftEnd, ArrowRightEnd, ThreeDotSaving } from "@comet/admin-icons";
import { writeClipboard } from "@comet/blocks-admin";
import React from "react";
import { FormattedMessage } from "react-intl";

import { convertTextContentsToCsv } from "./convertTextContentsToCsv";
import { subTreeFromNode, treeMapToArray } from "./treemap/TreeMapUtils";
import { useExtractImportPages } from "./useExtractPages";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface Props {
    page: PageTreePage;
}

export const ExtractImportMenuItem = ({ page }: Props): React.ReactElement => {
    const [extractLoading, setExtractLoading] = React.useState(false);
    const [importLoading, setImportLoading] = React.useState(false);

    const { extractContents, importContents, getContentsFromClipboard } = useExtractImportPages();
    const { tree } = usePageTreeContext();

    return (
        <>
            <RowActionsItem
                icon={!extractLoading ? <ArrowRightEnd /> : <ThreeDotSaving />}
                onClick={async () => {
                    setExtractLoading(true);
                    const subTree = subTreeFromNode(page, tree);
                    const pagesAsArray = treeMapToArray(subTree, "root");
                    const extractedContents = await extractContents(pagesAsArray);

                    const csv = convertTextContentsToCsv(extractedContents);
                    writeClipboard(csv);
                    setExtractLoading(false);
                }}
            >
                <FormattedMessage id="comet.pageTree.extract" defaultMessage="Extract contents" />
            </RowActionsItem>
            <RowActionsItem
                icon={!importLoading ? <ArrowLeftEnd /> : <ThreeDotSaving />}
                onClick={async () => {
                    setImportLoading(true);
                    const textContents = await getContentsFromClipboard();
                    const subTree = subTreeFromNode(page, tree);
                    const pagesAsArray = treeMapToArray(subTree, "root");

                    if (textContents.canPaste) {
                        await importContents(pagesAsArray, textContents.content);
                    }

                    setImportLoading(false);
                }}
            >
                <FormattedMessage id="comet.pageTree.import" defaultMessage="Import contents" />
            </RowActionsItem>
        </>
    );
};
