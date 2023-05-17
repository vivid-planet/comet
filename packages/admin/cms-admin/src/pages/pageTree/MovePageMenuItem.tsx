import { gql, useMutation } from "@apollo/client";
import { RowActionsItem, RowActionsMenu } from "@comet/admin";
import { MovePage } from "@comet/admin-icons";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useContentScope } from "../../contentScope/Provider";
import { GQLUpdatePageTreeNodeCategoryMutation, GQLUpdatePageTreeNodeCategoryMutationVariables } from "./MovePageMenuItem.generated";
import { PageTreePage } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

interface Props {
    page: PageTreePage;
}

export function MovePageMenuItem({ page }: Props): React.ReactElement | null {
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

    const handleSubMenuItemClick = async (category: string) => {
        const refetchQueries = [
            { query, variables: { contentScope: scope, category } },
            { query, variables: { contentScope: scope, category: page.category } },
        ];

        await updatePageTreeNodeCategory({
            variables: { id: page.id, category },
            refetchQueries,
        });
    };

    return (
        <RowActionsMenu icon={<MovePage />} text={<FormattedMessage id="comet.pages.pages.page.movePage" defaultMessage="Move page" />}>
            {allCategories.map(({ category, label }) => (
                <RowActionsItem key={category} disabled={category === page.category || submitting} onClick={() => handleSubMenuItemClick(category)}>
                    {label}
                </RowActionsItem>
            ))}
        </RowActionsMenu>
    );
}
