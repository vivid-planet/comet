import { useApolloClient } from "@apollo/client";
import { IEditDialogApi, RowActions, RowActionsMenuItem, useStackSwitchApi } from "@comet/admin";
import { Add, Copy, Delete, Domain, Edit, Paste, Preview, Settings, ThreeDotSaving } from "@comet/admin-icons";
import { writeClipboard } from "@comet/blocks-admin";
import { Divider } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useContentScope } from "../../contentScope/Provider";
import { serializeInitialValues } from "../../form/serializeInitialValues";
import {
    GQLDeletePageTreeNodeMutation,
    GQLDeletePageTreeNodeMutationVariables,
    GQLPageTreePageFragment,
    namedOperations,
} from "../../graphql.generated";
import { openPreviewWindow } from "../../preview/openPreviewWindow";
import { MovePageMenuItem } from "./MovePageMenuItem";
import { deletePageMutation } from "./Page.gql";
import { PageDeleteDialog } from "./PageDeleteDialog";
import { subTreeFromNode, traverse, treeMapToArray } from "./treemap/TreeMapUtils";
import { useCopyPastePages } from "./useCopyPastePages";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface Props {
    page: PageTreePage;
    editDialog: IEditDialogApi;
    children?: React.ReactNode[];
    siteUrl: string;
}

export default function PageActions({ page, editDialog, children, siteUrl }: Props): React.ReactElement {
    const [copyLoading, setCopyLoading] = React.useState(false);
    const [pasting, setPasting] = React.useState(false);
    const [duplicateLoading, setDuplicateLoading] = React.useState(false);

    const { prepareForClipboard, writeToClipboard, getFromClipboard, sendPages } = useCopyPastePages();
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const client = useApolloClient();

    const stackSwitchApi = useStackSwitchApi();
    const { match: contentScopeMatch } = useContentScope();
    const { documentTypes, tree } = usePageTreeContext();
    const isEditable = Boolean(page.visibility !== "Archived" && documentTypes[page.documentType].editComponent);

    const handleDeleteClick = async () => {
        const subTree = subTreeFromNode(page, tree);
        const deletedOrderedNodes: GQLPageTreePageFragment[] = [];
        traverse(
            subTree,
            (element) => {
                deletedOrderedNodes.push(element);
            },
            "post-order",
        );
        for (const node of deletedOrderedNodes) {
            await client.mutate<GQLDeletePageTreeNodeMutation, GQLDeletePageTreeNodeMutationVariables>({
                mutation: deletePageMutation,
                variables: { id: node.id },
                refetchQueries: [namedOperations.Query.Pages],
            });
        }
        setDeleteDialogOpen(false);
    };

    const deletePageMenuAction: RowActionsMenuItem = {
        text: <FormattedMessage id="comet.pages.pages.page.delete" defaultMessage="Delete" />,
        icon: <Delete />,
        onClick: (_, closeMenu) => {
            closeMenu();
            setDeleteDialogOpen(true);
        },
    };

    const allMenuActions: RowActionsMenuItem[] = [
        {
            text: <FormattedMessage id="comet.pages.pages.page.editContent" defaultMessage="Edit content" />,
            icon: <Edit />,
            onClick: (_, closeMenu) => {
                closeMenu();
                stackSwitchApi.activatePage("edit", String(page.id));
            },
        },
        {
            text: <FormattedMessage id="comet.pages.pages.page.properties" defaultMessage="Page properties" />,
            icon: <Settings />,
            onClick: (_, closeMenu) => {
                closeMenu();
                editDialog?.openEditDialog(page.id);
            },
        },
        {
            text: <FormattedMessage id="comet.pages.pages.page.copyUrl" defaultMessage="Copy URL" />,
            icon: <Domain />,
            onClick: (_, closeMenu) => {
                closeMenu();
                writeClipboard(`${siteUrl}${page.path}`);
            },
        },
        <Divider key="menuDividerOne" />,
        {
            text: <FormattedMessage id="comet.pages.pages.page.newSubpage" defaultMessage="New subpage" />,
            icon: <Add />,
            onClick: (_, closeMenu) => {
                closeMenu();
                editDialog?.openAddDialog(serializeInitialValues({ parent: page.id }));
            },
        },
        (closeMenu) => <MovePageMenuItem key="movePage" page={page} onClose={closeMenu} />,
        <Divider key="menuDividerTwo" />,
        {
            text: <FormattedMessage id="comet.pages.pages.page.copy" defaultMessage="Copy" />,
            icon: copyLoading ? <ThreeDotSaving /> : <Copy />,
            onClick: async (_, closeMenu) => {
                setCopyLoading(true);
                const subTree = subTreeFromNode(page, tree);
                const pagesAsArray = treeMapToArray(subTree, "root");
                const pagesClipboard = await prepareForClipboard(pagesAsArray);
                await writeToClipboard(pagesClipboard);
                setCopyLoading(false);
                closeMenu();
            },
        },
        {
            text: <FormattedMessage id="comet.pages.pages.page.paste" defaultMessage="Paste" />,
            icon: pasting ? <ThreeDotSaving /> : <Paste />,
            onClick: async (_, closeMenu) => {
                setPasting(true);
                const pages = await getFromClipboard();
                if (pages.canPaste) {
                    await sendPages(page.parentId, pages.content, { targetPos: page.pos + 1 });
                }
                setPasting(false);
                closeMenu();
            },
        },
        {
            text: <FormattedMessage id="comet.pageTree.duplicate" defaultMessage="Duplicate" />,
            icon: duplicateLoading ? <ThreeDotSaving /> : <Copy />,
            onClick: async (_, closeMenu) => {
                setDuplicateLoading(true);
                const subTree = subTreeFromNode(page, tree);
                const pagesAsArray = treeMapToArray(subTree, "root");
                const pages = await prepareForClipboard(pagesAsArray);
                await sendPages(page.parentId, pages, { targetPos: page.pos + 1 });
                setDuplicateLoading(false);
                closeMenu();
            },
        },
        deletePageMenuAction,
    ];

    return (
        <>
            {children && children}
            <RowActions
                componentsProps={{ menu: { PaperProps: { sx: { minWidth: 280 } } } }}
                iconActions={
                    page.visibility !== "Archived"
                        ? [
                              {
                                  disabled: !isEditable,
                                  onClick: () => stackSwitchApi.activatePage("edit", String(page.id)),
                                  icon: <Edit />,
                                  color: isEditable ? "primary" : "inherit",
                              },
                              {
                                  icon: <Preview />,
                                  onClick: () => openPreviewWindow(page.path, contentScopeMatch.url),
                              },
                          ]
                        : undefined
                }
                menuActions={page.visibility === "Archived" ? [deletePageMenuAction] : allMenuActions}
            />

            <PageDeleteDialog
                dialogOpen={deleteDialogOpen}
                handleCancelClick={() => {
                    setDeleteDialogOpen(false);
                }}
                handleDeleteClick={handleDeleteClick}
                selectedNodes={[page]}
            />
        </>
    );
}
