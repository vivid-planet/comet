import { useApolloClient } from "@apollo/client";
import { UndoSnackbar, useSnackbarApi } from "@comet/admin";
import { Archive, Copy, Delete, Disabled, Online, Paste, ThreeDotSaving, TreeCollapseAll } from "@comet/admin-icons";
import { Button, Checkbox, Grid, IconButton, Tooltip, useTheme } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { deletePageMutation, GQLDeletePageTreeNodeMutation, GQLDeletePageTreeNodeMutationVariables } from "../pageTree/Page";
import { PageDeleteDialog } from "../pageTree/PageDeleteDialog";
import { traverse, TreeMap, treeMapToArray } from "../pageTree/treemap/TreeMapUtils";
import { useCopyPastePages } from "../pageTree/useCopyPastePages";
import { GQLPageTreePageFragment, PageTreeSelectionState } from "../pageTree/usePageTree";
import { usePageTreeContext } from "../pageTree/usePageTreeContext";
import { areAllSubTreesFullSelected } from "./areAllSubTreesFullSelected";
import { ConfirmPageActionDialog } from "./ConfirmPageActionDialog";
import { PageCanNotDeleteDialog } from "./PageCanNotDeleteDialog";
import { CenterContainer, Root, SelectAllLabel, Separator } from "./PagesPageActionToolbar.sc";
import { pageTreeBatchResetVisibility, pageTreeBatchUpdateVisibility } from "./PagesPageActionToolbarBatchUpdateHelper";

export type PageAction = "publish" | "unpublish" | "archive";

interface ConfirmActionState {
    action: PageAction;
    handleAction: () => void;
}

export interface PagesPageActionToolbarProps {
    selectedState: PageTreeSelectionState;
    onSelectAllPressed: () => void;

    selectedTree: TreeMap<GQLPageTreePageFragment>;

    /* Collapse Buttons*/
    collapseAllDisabled: boolean;
    onCollapseAllPressed: () => void;
}

export const PagesPageActionToolbar: React.FunctionComponent<PagesPageActionToolbarProps> = ({
    selectedState,
    selectedTree,
    onSelectAllPressed,
    collapseAllDisabled,
    onCollapseAllPressed,
}) => {
    const [showCanNotDeleteDialog, setShowCanNotDeleteDialog] = React.useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState<ConfirmActionState | null>(null);

    const { tree } = usePageTreeContext();
    const [publishLoading, setPublishLoading] = React.useState(false);
    const [unpublishLoading, setUnpublishLoading] = React.useState(false);
    const [archiveLoading, setArchiveLoading] = React.useState(false);
    const [copyLoading, setCopyLoading] = React.useState(false);
    const [pasteLoading, setPasteLoading] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const { prepareForClipboard, writeToClipboard, getFromClipboard, sendPages, progressDialog } = useCopyPastePages();

    const theme = useTheme();
    const client = useApolloClient();
    const snackbarApi = useSnackbarApi();

    const showUndoSnackbar = (pageTreeNodes: GQLPageTreePageFragment[], message: React.ReactNode) => {
        snackbarApi.showSnackbar(
            <UndoSnackbar
                message={message}
                payload={pageTreeNodes}
                onUndoClick={async (pageTreeNodes) => {
                    if (pageTreeNodes) {
                        await pageTreeBatchResetVisibility(client, pageTreeNodes);
                    }
                }}
            />,
        );
    };

    const handlePublish = async () => {
        setPublishLoading(true);
        const pageTreeNodes = treeMapToArray(selectedTree);
        await pageTreeBatchUpdateVisibility(client, pageTreeNodes, "Published");
        setPublishLoading(false);

        showUndoSnackbar(
            pageTreeNodes,
            <FormattedMessage id="comet.pagesPageActionToolbar.undo.publishedSelected" defaultMessage="Published selected pages" />,
        );
    };

    const handleUnpublish = async () => {
        setUnpublishLoading(true);
        const pageTreeNodes = treeMapToArray(selectedTree);
        await pageTreeBatchUpdateVisibility(client, pageTreeNodes, "Unpublished");
        setUnpublishLoading(false);

        showUndoSnackbar(
            pageTreeNodes,
            <FormattedMessage id="comet.pagesPageActionToolbar.undo.unpublishedSelected" defaultMessage="Unpublished selected pages" />,
        );
    };

    const handleArchive = async () => {
        setArchiveLoading(true);
        const pageTreeNodes = treeMapToArray(selectedTree);
        await pageTreeBatchUpdateVisibility(client, pageTreeNodes, "Archived");
        setArchiveLoading(false);

        showUndoSnackbar(
            pageTreeNodes,
            <FormattedMessage id="comet.pagesPageActionToolbar.undo.archivedSelected" defaultMessage="Archived selected pages" />,
        );
    };

    return (
        <>
            {progressDialog}
            <Root container justifyContent="space-between">
                <Grid item>
                    <SelectAllLabel
                        control={
                            <Checkbox
                                checked={selectedState === "all_selected"}
                                indeterminate={selectedState === "some_selected"}
                                onChange={onSelectAllPressed}
                            />
                        }
                        label={<FormattedMessage id="comet.pagesPageActionToolbar.selectAll" defaultMessage="Select all" />}
                    />
                </Grid>
                <CenterContainer item>
                    <Tooltip title={<FormattedMessage id="comet.pagesPageActionToolbar.tooltip.publish" defaultMessage="Publish" />}>
                        <span>
                            <IconButton
                                disabled={selectedTree.size === 0}
                                onClick={async () => {
                                    setConfirmAction({ action: "publish", handleAction: handlePublish });
                                }}
                                size="large"
                            >
                                {!publishLoading ? (
                                    <Online htmlColor={selectedTree.size > 0 ? theme.palette.success.main : undefined} />
                                ) : (
                                    <ThreeDotSaving />
                                )}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id="comet.pagesPageActionToolbar.tooltip.unpublish" defaultMessage="Unpublish" />}>
                        <span>
                            <IconButton
                                disabled={selectedTree.size === 0}
                                onClick={async () => {
                                    setConfirmAction({ action: "unpublish", handleAction: handleUnpublish });
                                }}
                                size="large"
                            >
                                {!unpublishLoading ? <Disabled /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id="comet.pagesPageActionToolbar.tooltip.archive" defaultMessage="Archive" />}>
                        <span>
                            <IconButton
                                disabled={selectedTree.size === 0}
                                onClick={async () => {
                                    setConfirmAction({ action: "archive", handleAction: handleArchive });
                                }}
                                size="large"
                            >
                                {!archiveLoading ? <Archive /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Separator />
                    <Tooltip title={<FormattedMessage id="comet.pagesPageActionToolbar.tooltip.copy" defaultMessage="Copy" />}>
                        <span>
                            <IconButton
                                disabled={selectedTree.size === 0}
                                onClick={async () => {
                                    setCopyLoading(true);
                                    const pagesAsArray = treeMapToArray(selectedTree, "root");
                                    const pagesClipboard = await prepareForClipboard(pagesAsArray);
                                    await writeToClipboard(pagesClipboard);
                                    setCopyLoading(false);
                                }}
                                size="large"
                            >
                                {!copyLoading ? <Copy /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id="comet.pagesPageActionToolbar.tooltip.paste" defaultMessage="Paste" />}>
                        <span>
                            <IconButton
                                onClick={async () => {
                                    setPasteLoading(true);
                                    const pages = await getFromClipboard();
                                    if (pages.canPaste) {
                                        await sendPages(null, pages.content, { targetPos: undefined });
                                    }
                                    setPasteLoading(false);
                                }}
                                disabled={false /* TODO: enable/disable paste possibility*/}
                                size="large"
                            >
                                {!pasteLoading ? <Paste /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id="comet.pagesPageActionToolbar.tooltip.delete" defaultMessage="Delete" />}>
                        <span>
                            <IconButton
                                disabled={selectedTree.size === 0}
                                onClick={async () => {
                                    const selectedNodeIds: string[] = treeMapToArray(selectedTree).map((element) => {
                                        return element.id;
                                    });
                                    const canSaveDelete = areAllSubTreesFullSelected(selectedNodeIds, tree);
                                    if (canSaveDelete) {
                                        setShowDeleteDialog(true);
                                    } else {
                                        setShowCanNotDeleteDialog(true);
                                    }
                                }}
                                size="large"
                            >
                                {!deleting ? <Delete /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                </CenterContainer>
                <Grid item>
                    <Button disabled={collapseAllDisabled} startIcon={<TreeCollapseAll />} onClick={onCollapseAllPressed} size="small" color="info">
                        <FormattedMessage id="comet.pages.pages.collapseAll" defaultMessage="Collapse all" />
                    </Button>
                </Grid>
            </Root>
            <ConfirmPageActionDialog
                open={confirmAction !== null}
                action={confirmAction?.action}
                onCloseDialog={(confirmed) => {
                    if (confirmed) {
                        confirmAction?.handleAction();
                    }
                    setConfirmAction(null);
                }}
                selectedPagesCount={treeMapToArray(selectedTree).length}
            />
            <PageDeleteDialog
                dialogOpen={showDeleteDialog}
                handleCancelClick={() => {
                    setShowDeleteDialog(false);
                }}
                handleDeleteClick={async () => {
                    setShowDeleteDialog(false);
                    setDeleting(true);
                    const selectedNodeIds: string[] = treeMapToArray(selectedTree).map((element) => {
                        return element.id;
                    });
                    const canSaveDelete = areAllSubTreesFullSelected(selectedNodeIds, tree);
                    if (canSaveDelete) {
                        const deletedOrderedNodes: GQLPageTreePageFragment[] = [];
                        traverse(
                            selectedTree,
                            (element) => {
                                deletedOrderedNodes.push(element);
                            },
                            "post-order",
                        );

                        try {
                            for (const node of deletedOrderedNodes) {
                                await client.mutate<GQLDeletePageTreeNodeMutation, GQLDeletePageTreeNodeMutationVariables>({
                                    mutation: deletePageMutation,
                                    variables: { id: node.id },
                                });
                            }
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.error("Error deleting pages");
                        } finally {
                            client.refetchQueries({ include: ["Pages"] });
                        }
                    } else {
                        setShowCanNotDeleteDialog(true);
                    }
                    setDeleting(false);
                }}
                selectedNodes={treeMapToArray(selectedTree)}
            />
            <PageCanNotDeleteDialog
                dialogOpen={showCanNotDeleteDialog}
                onClosePressed={() => {
                    setShowCanNotDeleteDialog(false);
                }}
            />
        </>
    );
};
