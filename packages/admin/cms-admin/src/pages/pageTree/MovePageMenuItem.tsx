import { gql, useMutation } from "@apollo/client";
import { ChevronRight, MovePage } from "@comet/admin-icons";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useContentScope } from "../../contentScope/Provider";
import { GQLUpdatePageTreeNodeCategoryMutation, GQLUpdatePageTreeNodeCategoryMutationVariables } from "../../graphql.generated";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface Props {
    page: PageTreePage;
    onClose: () => void;
}

function MovePageMenuItem({ page, onClose }: Props): React.ReactElement | null {
    const [subMenuAnchorEl, setSubMenuAnchorEl] = React.useState<HTMLElement>();
    const [updatePageTreeNodeCategory, { loading: submitting }] = useMutation<
        GQLUpdatePageTreeNodeCategoryMutation,
        GQLUpdatePageTreeNodeCategoryMutationVariables
    >(gql`
        mutation UpdatePageTreeNodeCategory($id: ID!, $category: String!) {
            updatePageTreeNodeCategory(id: $id, category: $category) {
                id
                category
            }
        }
    `);
    const { scope } = useContentScope();
    const { allCategories, query } = usePageTreeContext();

    if (allCategories.length <= 1) {
        return null;
    }

    const handleMenuItemClick: React.MouseEventHandler<HTMLElement> = (event) => {
        setSubMenuAnchorEl(event.currentTarget);
    };

    const handleSubMenuClose = () => {
        setSubMenuAnchorEl(undefined);
        onClose();
    };

    const handleSubMenuItemClick = async (category: string) => {
        const refetchQueries = [
            { query, variables: { contentScope: scope, category } },
            { query, variables: { contentScope: scope, category: page.category } },
        ];

        await updatePageTreeNodeCategory({
            variables: { id: page.id, category },
            refetchQueries,
        });

        handleSubMenuClose();
    };

    return (
        <>
            <MenuItem onClick={handleMenuItemClick}>
                <ListItemIcon>
                    <MovePage />
                </ListItemIcon>
                <ListItemText primary={<FormattedMessage id="comet.pages.pages.page.movePage" defaultMessage="Move page" />} />
                <ChevronRight color="action" />
            </MenuItem>
            <Menu
                open={Boolean(subMenuAnchorEl)}
                anchorEl={subMenuAnchorEl}
                anchorOrigin={{ vertical: "center", horizontal: "left" }}
                transformOrigin={{ vertical: "center", horizontal: "right" }}
                onClose={handleSubMenuClose}
            >
                {allCategories.map(({ category, label }) => (
                    <MenuItem key={category} disabled={category === page.category || submitting} onClick={() => handleSubMenuItemClick(category)}>
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export { MovePageMenuItem };
