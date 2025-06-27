import { gql, useMutation } from "@apollo/client";
import { RowActionsItem, RowActionsMenu } from "@comet/admin";
import { MovePage } from "@comet/admin-icons";
import { FormattedMessage } from "react-intl";

<<<<<<< HEAD
import { useContentScope } from "../../contentScope/Provider";
import { type DocumentInterface, type DocumentType } from "../../documents/types";
import { usePageTreeConfig } from "../pageTreeConfig";
import { type GQLUpdatePageTreeNodeCategoryMutation, type GQLUpdatePageTreeNodeCategoryMutationVariables } from "./MovePageMenuItem.generated";
import { type PageTreePage } from "./usePageTree";
=======
import { DocumentInterface, DocumentType } from "../../documents/types";
import { usePageTreeScope } from "../config/usePageTreeScope";
import { GQLUpdatePageTreeNodeCategoryMutation, GQLUpdatePageTreeNodeCategoryMutationVariables } from "./MovePageMenuItem.generated";
import { PageTreePage } from "./usePageTree";
>>>>>>> main
import { usePageTreeContext } from "./usePageTreeContext";

interface Props {
    page: PageTreePage;
}

export function MovePageMenuItem({ page }: Props) {
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
<<<<<<< HEAD
    const { scope } = useContentScope();
    const { categories } = usePageTreeConfig();
    const { query, getDocumentTypesByCategory } = usePageTreeContext();
=======
    const scope = usePageTreeScope();
    const { allCategories, query, getDocumentTypesByCategory } = usePageTreeContext();
>>>>>>> main

    if (categories.length <= 1) {
        return null;
    }

    const handleSubMenuItemClick = async (category: string) => {
        if (!categorySupportsDocumentType(category, page.documentType, getDocumentTypesByCategory)) {
            throw new Error(`Cannot move: Target category doesn't support documentType ${page.documentType}`);
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
            {categories.map(({ category, label }) => {
                const canMoveToTargetCategory = categorySupportsDocumentType(category, page.documentType, getDocumentTypesByCategory);

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
    getDocumentTypesByCategory?: (category: string) => Record<DocumentType, DocumentInterface>,
) => {
    if (getDocumentTypesByCategory === undefined) {
        // fallback if no category->documentTypes mapping function was passed
        return true;
    }

    const supportedDocumentTypes = Object.keys(getDocumentTypesByCategory(category));
    return supportedDocumentTypes.includes(documentType);
};
