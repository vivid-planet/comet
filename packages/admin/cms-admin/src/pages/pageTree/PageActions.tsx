import { useApolloClient } from "@apollo/client";
import { IEditDialogApi, RowActionsItem, RowActionsMenu, useStackSwitchApi, writeClipboardText } from "@comet/admin";
import { Add, Delete, Domain, Edit, Preview, Settings } from "@comet/admin-icons";
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
import { openSitePreviewWindow } from "../../preview/openSitePreviewWindow";
import { CopyPasteMenuItem } from "./CopyPasteMenuItem";
import { MovePageMenuItem } from "./MovePageMenuItem";
import { deletePageMutation } from "./Page.gql";
import { PageDeleteDialog } from "./PageDeleteDialog";
import { subTreeFromNode, traverse } from "./treemap/TreeMapUtils";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface Props {
    page: PageTreePage;
    editDialog: IEditDialogApi;
    children?: React.ReactNode[];
    siteUrl: string;
}

export default function PageActions({ page, editDialog, children, siteUrl }: Props): React.ReactElement {
    const { tree } = usePageTreeContext();
    const { match: contentScopeMatch } = useContentScope();
    const { documentTypes } = usePageTreeContext();
    const stackSwitchApi = useStackSwitchApi();
    const client = useApolloClient();

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const isEditable = !!(page.visibility !== "Archived" && documentTypes[page.documentType].editComponent);

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

    return (
        <>
            <RowActionsMenu>
                {children && children}
                {page.visibility !== "Archived" && [
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
                    <RowActionsItem
                        key="preview"
                        icon={<Preview />}
                        onClick={() => {
                            openSitePreviewWindow(page.path, contentScopeMatch.url);
                        }}
                    >
                        <FormattedMessage id="comet.pages.pages.page.openPreview" defaultMessage="Open preview" />
                    </RowActionsItem>,
                ]}
                <RowActionsMenu>
                    {page.visibility !== "Archived" && [
                        <RowActionsItem
                            key="edit"
                            icon={<Edit />}
                            onClick={() => {
                                stackSwitchApi.activatePage("edit", String(page.id));
                            }}
                        >
                            <FormattedMessage id="comet.pages.pages.page.editContent" defaultMessage="Edit content" />
                        </RowActionsItem>,
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
                        <Divider key="divider3" />,
                    ]}
                    <RowActionsItem
                        icon={<Delete />}
                        disabled={page.slug === "home"}
                        onClick={() => {
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <FormattedMessage id="comet.pages.pages.page.delete" defaultMessage="Delete" />
                    </RowActionsItem>
                </RowActionsMenu>
            </RowActionsMenu>
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
