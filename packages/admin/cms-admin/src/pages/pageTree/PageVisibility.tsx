import { gql, useMutation } from "@apollo/client";
import { UndoSnackbar, useSnackbarApi } from "@comet/admin";
import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLPageTreeNodeVisibility } from "../../graphql.generated";
import { GQLUpdatePageVisibilityMutation, GQLUpdatePageVisibilityMutationVariables } from "./PageVisibility.generated";
import { PageVisibilityIcon } from "./PageVisibilityIcon";
import { subTreeFromNode, treeMapToArray } from "./treemap/TreeMapUtils";
import { GQLPageTreePageFragment, PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

export { GQLUpdatePageVisibilityMutation, GQLUpdatePageVisibilityMutationVariables } from "./PageVisibility.generated";

export const updatePageVisibilityMutation = gql`
    mutation UpdatePageVisibility($id: ID!, $input: PageTreeNodeUpdateVisibilityInput!) {
        updatePageTreeNodeVisibility(id: $id, input: $input) {
            id
            visibility
            path
            slug
        }
    }
`;

interface PageVisibilityProps {
    page: PageTreePage;
}

const PageVisibility = ({ page }: PageVisibilityProps): React.ReactElement => {
    const { tree } = usePageTreeContext();
    const snackbarApi = useSnackbarApi();
    const [updatePageVisibility] = useMutation<GQLUpdatePageVisibilityMutation, GQLUpdatePageVisibilityMutationVariables>(
        updatePageVisibilityMutation,
    );
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const updatePageVisibilityRequest = (page: GQLPageTreePageFragment, visibility: GQLPageTreeNodeVisibility) => {
        updatePageVisibility({
            variables: {
                id: page.id,
                input: { visibility },
            },
            optimisticResponse: {
                updatePageTreeNodeVisibility: {
                    __typename: "PageTreeNode",
                    id: page.id,
                    visibility,
                    path: page.path,
                    slug: page.slug,
                },
            },
        });
    };

    const handleVisibilityClick = (visibility: GQLPageTreeNodeVisibility) => {
        const subTree = subTreeFromNode(page, tree);
        const nodes: GQLPageTreePageFragment[] = visibility === "Archived" ? treeMapToArray(subTree) : [page];

        nodes.forEach((node) => {
            updatePageVisibilityRequest(node, visibility);
        });
        handleMenuClose();

        snackbarApi.showSnackbar(
            <UndoSnackbar
                message={
                    <FormattedMessage
                        id="comet.pagetree.pageVisibilityChanged"
                        defaultMessage="{name} {visibility, select, visible {published} hidden {unpublished} archived {archived} other {unknown}}"
                        values={{
                            name: page.name,
                            visibility: visibility === "Published" ? "visible" : visibility === "Unpublished" ? "hidden" : "archived",
                        }}
                    />
                }
                payload={{ nodes }}
                onUndoClick={(payload) => {
                    if (payload != null) {
                        payload.nodes.forEach((node) => {
                            updatePageVisibilityRequest(node, node.visibility);
                        });
                    }
                }}
            />,
        );
    };

    return (
        <>
            <Button size="small" onClick={handleMenuOpen} startIcon={<PageVisibilityIcon visibility={page.visibility} />} color="info">
                <FormattedMessage
                    id="comet.pages.pages.page.visibility"
                    defaultMessage="{visibility, select, visible {Published} hidden {Unpublished} archived {Archived} other {unknown}}"
                    values={{
                        visibility: page.visibility === "Published" ? "visible" : page.visibility === "Unpublished" ? "hidden" : "archived",
                    }}
                />
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleVisibilityClick("Published")} disabled={page.visibility === "Published"}>
                    <ListItemIcon>
                        <PageVisibilityIcon visibility="Published" disabled={page.visibility === "Published"} />
                    </ListItemIcon>
                    <FormattedMessage id="comet.pages.pages.page.visibility.published" defaultMessage="Published" />
                </MenuItem>
                <MenuItem onClick={() => handleVisibilityClick("Unpublished")} disabled={page.visibility === "Unpublished" || page.slug === "home"}>
                    <ListItemIcon>
                        <PageVisibilityIcon visibility="Unpublished" disabled={page.visibility === "Unpublished" || page.slug === "home"} />
                    </ListItemIcon>
                    <FormattedMessage id="comet.pages.pages.page.visibility.unpublished" defaultMessage="Unpublished" />
                </MenuItem>
                <MenuItem onClick={() => handleVisibilityClick("Archived")} disabled={page.visibility === "Archived" || page.slug === "home"}>
                    <ListItemIcon>
                        <PageVisibilityIcon visibility="Archived" disabled={page.visibility === "Archived" || page.slug === "home"} />
                    </ListItemIcon>
                    <FormattedMessage id="comet.pages.pages.page.visibility.archived" defaultMessage="Archived" />
                </MenuItem>
            </Menu>
        </>
    );
};

export default PageVisibility;
