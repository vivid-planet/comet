import { useApolloClient } from "@apollo/client";
import { Archive, Copy, Delete, Disabled, Online, Paste, ThreeDotSaving, TreeCollapseAll } from "@comet/admin-icons";
import { Button, Checkbox, FormControlLabel, Grid, IconButton, Tooltip } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useTheme } from "styled-components";

import {
    GQLDeletePageTreeNodeMutation,
    GQLDeletePageTreeNodeMutationVariables,
    GQLPageTreePageFragment,
    namedOperations,
} from "../../graphql.generated";
import { deletePageMutation } from "../pageTree/Page.gql";
import { PageDeleteDialog } from "../pageTree/PageDeleteDialog";
import { traverse, TreeMap, treeMapToArray } from "../pageTree/treemap/TreeMapUtils";
import { useCopyPastePages } from "../pageTree/useCopyPastePages";
import { PageTreeSelectionState } from "../pageTree/usePageTree";
import { usePageTreeContext } from "../pageTree/usePageTreeContext";
import { areAllSubTreesFullSelected } from "./areAllSubTreesFullSelected";
import { PageCanNotDeleteDialog } from "./PageCanNotDeleteDialog";
import { Separator, useStyles } from "./PagesPageActionToolbar.sc";
import { pageTreeBatchUpdateVisibility } from "./PagesPageActionToolbarBatchUpdateHelper";

export interface PagesPageActionToolbarProps {
    selectedState: PageTreeSelectionState;
    onSelectAllPressed: () => void;

    selectedTree: TreeMap<GQLPageTreePageFragment>;

    /* Collapse Buttons*/
    onCollapseAllPressed: () => void;
}

export const PagesPageActionToolbar: React.FunctionComponent<PagesPageActionToolbarProps> = ({
    selectedState,
    selectedTree,
    onSelectAllPressed,
    onCollapseAllPressed,
}) => {
    const [showCanNotDeleteDialog, setShowCanNotDeleteDialog] = React.useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

    const { tree } = usePageTreeContext();
    const [publishLoading, setPublishLoading] = React.useState(false);
    const [unpublishLoading, setUnpublishLoading] = React.useState(false);
    const [archiveLoading, setArchiveLoading] = React.useState(false);
    const [copyLoading, setCopyLoading] = React.useState(false);
    const [pasteLoading, setPasteLoading] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const { prepareForClipboard, writeToClipboard, getFromClipboard, sendPages } = useCopyPastePages();

    const classes = useStyles();
    const theme = useTheme();
    const client = useApolloClient();

    return (
        <>
            <Grid container justifyContent="space-between" classes={{ root: classes.root }}>
                <Grid item>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedState === "all_selected"}
                                indeterminate={selectedState === "some_selected"}
                                onChange={onSelectAllPressed}
                            />
                        }
                        label={<FormattedMessage id="comet.pagesPageActionToolbar.selectAll" defaultMessage="Select all" />}
                        classes={{ root: classes.selectAllFromControlLabel }}
                    />
                </Grid>
                <Grid item classes={{ root: classes.centerContainer }}>
                    <Tooltip title={<FormattedMessage id={"comet.pagesPageActionToolbar.tooltip.publish"} defaultMessage={"Publish"} />}>
                        <span>
                            <IconButton
                                disabled={selectedTree.size === 0}
                                onClick={async () => {
                                    setPublishLoading(true);
                                    const pageTreeNodes = treeMapToArray(selectedTree);
                                    await pageTreeBatchUpdateVisibility(client, pageTreeNodes, "Published");
                                    setPublishLoading(false);
                                }}
                            >
                                {!publishLoading ? (
                                    <Online htmlColor={selectedTree.size > 0 ? theme.palette.success.main : undefined} />
                                ) : (
                                    <ThreeDotSaving />
                                )}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id={"comet.pagesPageActionToolbar.tooltip.unpublish"} defaultMessage={"Unpublish"} />}>
                        <span>
                            <IconButton
                                disabled={selectedTree.size === 0}
                                onClick={async () => {
                                    setUnpublishLoading(true);

                                    const pageTreeNodes = treeMapToArray(selectedTree);
                                    await pageTreeBatchUpdateVisibility(client, pageTreeNodes, "Unpublished");
                                    setUnpublishLoading(false);
                                }}
                            >
                                {!unpublishLoading ? <Disabled /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id={"comet.pagesPageActionToolbar.tooltip.archive"} defaultMessage={"Archive"} />}>
                        <span>
                            <IconButton
                                disabled={selectedTree.size === 0}
                                onClick={async () => {
                                    setArchiveLoading(true);
                                    const pageTreeNodes = treeMapToArray(selectedTree);
                                    await pageTreeBatchUpdateVisibility(client, pageTreeNodes, "Archived");
                                    setArchiveLoading(false);
                                }}
                            >
                                {!archiveLoading ? <Archive /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Separator />
                    <Tooltip title={<FormattedMessage id={"comet.pagesPageActionToolbar.tooltip.copy"} defaultMessage={"Copy"} />}>
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
                            >
                                {!copyLoading ? <Copy /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id={"comet.pagesPageActionToolbar.tooltip.paste"} defaultMessage={"Paste"} />}>
                        <span>
                            <IconButton
                                onClick={async () => {
                                    setPasteLoading(true);
                                    const pages = await getFromClipboard();
                                    if (pages.canPaste) {
                                        await sendPages(null, pages.content);
                                    }
                                    setPasteLoading(false);
                                }}
                                disabled={false /* TODO: enable/disable paste possibility*/}
                            >
                                {!pasteLoading ? <Paste /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={<FormattedMessage id={"comet.pagesPageActionToolbar.tooltip.delete"} defaultMessage={"Delete"} />}>
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
                            >
                                {!deleting ? <Delete /> : <ThreeDotSaving />}
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Button startIcon={<TreeCollapseAll />} onClick={onCollapseAllPressed} size="small">
                        <FormattedMessage id="comet.pages.pages.collapseAll" defaultMessage="Collapse all" />
                    </Button>
                </Grid>
            </Grid>
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
                            client.refetchQueries({ include: [namedOperations.Query.Pages] });
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
