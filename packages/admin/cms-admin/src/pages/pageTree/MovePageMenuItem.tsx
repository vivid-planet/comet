import { gql, useMutation } from "@apollo/client";
import { RowActionsItem, RowActionsMenu, useErrorDialog } from "@comet/admin";
import { MovePage } from "@comet/admin-icons";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useContentScope } from "../../contentScope/Provider";
import { DocumentInterface, DocumentType } from "../../documents/types";
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
    const { allCategories, query, categoryToDocumentTypesMap } = usePageTreeContext();
    const errorDialogApi = useErrorDialog();

    if (allCategories.length <= 1) {
        return null;
    }

    const handleSubMenuItemClick = async (category: string) => {
        if (!categorySupportsDocumentType(category, page.documentType, categoryToDocumentTypesMap)) {
            errorDialogApi?.showError({ error: `Cannot move: Target category doesn't support documentType ${page.documentType}` });
            return;
        }

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
            {allCategories.map(({ category, label }) => {
                const canMoveToTargetCategory = categorySupportsDocumentType(category, page.documentType, categoryToDocumentTypesMap);

                return (
                    <RowActionsItem
                        key={category}
                        disabled={category === page.category || !canMoveToTargetCategory || submitting}
                        onClick={() => handleSubMenuItemClick(category)}
                    >
                        {label}
                    </RowActionsItem>
                );
            })}
        </RowActionsMenu>
    );
}

const categorySupportsDocumentType = (
    category: string,
    documentType: string,
    categoryToDocumentTypesMap?: {
        [category: string]: Record<DocumentType, DocumentInterface>;
    },
) => {
    if (categoryToDocumentTypesMap === undefined) {
        // fallback because categoryToDocumentTypesMap can be undefined
        return true;
    }

    const supportedDocumentTypes = Object.keys(categoryToDocumentTypesMap[category]);
    return supportedDocumentTypes.includes(documentType);
};
