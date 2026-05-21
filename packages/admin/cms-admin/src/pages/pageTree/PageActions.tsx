import { useApolloClient } from "@apollo/client";
import { type IEditDialogApi, RowActionsItem, RowActionsMenu, useStackSwitchApi, writeClipboardText } from "@comet/admin";
import { Add, Delete, Domain, Edit, Preview, PreviewUnavailable, Settings, Translate } from "@comet/admin-icons";
import { Divider } from "@mui/material";
import { type PropsWithChildren, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useContentScope } from "../../contentScope/Provider";
import { serializeInitialValues } from "../../form/serializeInitialValues";
import { openSitePreviewWindow } from "../../preview/openSitePreviewWindow";
import { useUserPermissionCheck } from "../../userPermissions/hooks/currentUser";
import { usePageTreeConfig } from "../pageTreeConfig";
import { CopyPasteMenuItem } from "./CopyPasteMenuItem";
import { MovePageMenuItem } from "./MovePageMenuItem";
import { deletePageMutation, type GQLDeletePageTreeNodeMutation, type GQLDeletePageTreeNodeMutationVariables } from "./Page";
import { PageDeleteDialog } from "./PageDeleteDialog";
import { subTreeFromNode, traverse } from "./treemap/TreeMapUtils";
import type { GQLPageTreePageFragment, PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";
import { useTranslatePagesAction } from "./useTranslatePagesAction";

interface Props {
    page: PageTreePage;
    editDialog: IEditDialogApi;
    siteUrl: string;
}

export default function PageActions({ page, editDialog, children, siteUrl }: PropsWithChildren<Props>) {
    const { tree } = usePageTreeContext();
    const { match: contentScopeMatch } = useContentScope();
    const { documentTypes } = usePageTreeConfig();
    const isAllowed = useUserPermissionCheck();
    const stackSwitchApi = useStackSwitchApi();
    const client = useApolloClient();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const documentType = documentTypes[page.documentType];
    const {
        dialogs: translateDialogs,
        enabled: translateEnabled,
        hasTranslatableContent,
        translating,
        openDialog: openTranslateDialog,
    } = useTranslatePagesAction({
        pages: [page],
        documentTypes,
    });
    const isArchived = page.visibility === "Archived";
    const isEditable = !!(!isArchived && documentType.editComponent);
    const canDeletePageTreeNodes = isAllowed("pageTreeDeleteNode");

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
                refetchQueries: ["Pages"],
            });
        }
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <RowActionsMenu>
                {children}
                {!isArchived && [
                    <RowActionsItem
                        key="edit"
                        disabled={!isEditable}
                        icon={<Edit />}
                        onClick={() => {
                            stackSwitchApi.activatePage("edit", String(page.id));
                        }}
                        componentsProps={{
                            iconButton: {
                                color: "primary",
                            },
                        }}
                    >
                        <FormattedMessage id="comet.pages.pages.page.editContent" defaultMessage="Edit content" />
                    </RowActionsItem>,
                    documentType.SitePreviewAction ? (
                        <documentType.SitePreviewAction key="preview" pageTreeNode={page} />
                    ) : (
                        <RowActionsItem
                            key="preview"
                            icon={documentType.hasNoSitePreview ? <PreviewUnavailable /> : <Preview />}
                            onClick={() => {
                                openSitePreviewWindow(page.path, contentScopeMatch.url);
                            }}
                            disabled={documentType.hasNoSitePreview}
                        >
                            <FormattedMessage id="comet.pages.pages.page.openPreview" defaultMessage="Open preview" />
                        </RowActionsItem>
                    ),
                ]}
                <RowActionsMenu>
                    {!isArchived && [
                        <RowActionsItem
                            key="pageProperties"
                            icon={<Settings />}
                            onClick={() => {
                                editDialog?.openEditDialog(page.id);
                            }}
                        >
                            <FormattedMessage id="comet.pages.pages.page.properties" defaultMessage="Page properties" />
                        </RowActionsItem>,
                        <RowActionsItem
                            key="copyUrl"
                            icon={<Domain />}
                            onClick={() => {
                                writeClipboardText(`${siteUrl}${page.path}`);
                            }}
                        >
                            <FormattedMessage id="comet.pages.pages.page.copyUrl" defaultMessage="Copy URL" />
                        </RowActionsItem>,
                        <Divider key="divider1" />,
                        <RowActionsItem
                            key="newSubpage"
                            icon={<Add />}
                            onClick={() => {
                                editDialog?.openAddDialog(serializeInitialValues({ parent: page.id }));
                            }}
                        >
                            <FormattedMessage id="comet.pages.pages.page.newSubpage" defaultMessage="New subpage" />
                        </RowActionsItem>,
                        <MovePageMenuItem key="movePage" page={page} />,
                        <Divider key="divider2" />,
                        <CopyPasteMenuItem key="copyPaste" page={page} />,
                        translateEnabled && (
                            <RowActionsItem
                                key="translate"
                                icon={<Translate />}
                                disabled={translating || !hasTranslatableContent}
                                onClick={openTranslateDialog}
                            >
                                <FormattedMessage id="comet.translator.translate" defaultMessage="Translate" />
                            </RowActionsItem>
                        ),
                    ]}
                    {canDeletePageTreeNodes && !isArchived && <Divider key="divider3" />}
                    {canDeletePageTreeNodes && (
                        <RowActionsItem
                            icon={<Delete />}
                            disabled={page.slug === "home"}
                            onClick={() => {
                                setDeleteDialogOpen(true);
                            }}
                        >
                            <FormattedMessage id="comet.pages.pages.page.delete" defaultMessage="Delete" />
                        </RowActionsItem>
                    )}
                </RowActionsMenu>
            </RowActionsMenu>
            {translateDialogs}
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
