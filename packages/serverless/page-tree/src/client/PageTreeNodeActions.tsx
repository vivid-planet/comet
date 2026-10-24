import { DeleteDialog, RowActionsItem, RowActionsMenu } from "@dextinity/admin";
import { Add, Delete, Edit, MovePage } from "@dextinity/admin-icons";
import { Divider } from "@mui/material";
import { parseResponse } from "hono/client";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import type { PageTreeNodeItem } from "./pageTreeApi.types.js";
import { usePageTreeApi } from "./PageTreeApiProvider.js";
import { PageTreeNodeDialog } from "./PageTreeNodeDialog.js";
import { usePageTreeMutation } from "./usePageTreeMutation.js";

export function PageTreeNodeActions({ node }: { node: PageTreeNodeItem }) {
    const { client, categories } = usePageTreeApi();
    const [dialog, setDialog] = useState<"edit" | "addSubpage" | "delete">();
    const isArchived = node.visibility === "Archived";
    const isHome = node.slug === "home";

    const { mutate: moveToCategory } = usePageTreeMutation((category: string) =>
        parseResponse(client.nodes[":id"].category.$put({ param: { id: node.id }, json: { category } })),
    );
    const { mutateAsync: deleteNode } = usePageTreeMutation(() => parseResponse(client.nodes[":id"].$delete({ param: { id: node.id } })));

    return (
        <>
            <RowActionsMenu>
                <RowActionsMenu>
                    <RowActionsItem icon={<Edit />} disabled={isArchived} onClick={() => setDialog("edit")}>
                        <FormattedMessage id="dextinity.pageTree.editProperties" defaultMessage="Edit properties" />
                    </RowActionsItem>
                    <RowActionsItem icon={<Add />} disabled={isArchived} onClick={() => setDialog("addSubpage")}>
                        <FormattedMessage id="dextinity.pageTree.addSubpage" defaultMessage="Add subpage" />
                    </RowActionsItem>
                    {categories
                        .filter(({ category }) => category !== node.category)
                        .map(({ category, label }) => (
                            <RowActionsItem key={category} icon={<MovePage />} disabled={isArchived} onClick={() => moveToCategory(category)}>
                                <FormattedMessage
                                    id="dextinity.pageTree.moveToCategory"
                                    defaultMessage="Move to {category}"
                                    values={{ category: label }}
                                />
                            </RowActionsItem>
                        ))}
                    <Divider />
                    <RowActionsItem icon={<Delete />} disabled={isHome} onClick={() => setDialog("delete")}>
                        <FormattedMessage id="dextinity.pageTree.delete" defaultMessage="Delete" />
                    </RowActionsItem>
                </RowActionsMenu>
            </RowActionsMenu>
            {dialog === "edit" && <PageTreeNodeDialog node={node} category={node.category} onClose={() => setDialog(undefined)} />}
            {dialog === "addSubpage" && <PageTreeNodeDialog parent={node} category={node.category} onClose={() => setDialog(undefined)} />}
            <DeleteDialog
                dialogOpen={dialog === "delete"}
                onCancel={() => setDialog(undefined)}
                onDelete={async () => {
                    await deleteNode(undefined);
                    setDialog(undefined);
                }}
            />
        </>
    );
}
