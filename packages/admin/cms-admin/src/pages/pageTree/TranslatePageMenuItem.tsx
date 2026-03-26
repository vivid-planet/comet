import { gql, useApolloClient } from "@apollo/client";
import { RowActionsItem, useContentTranslationService, useErrorDialog } from "@comet/admin";
import { Translate } from "@comet/admin-icons";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { type DocumentInterface, type GQLDocument } from "../../documents/types";
import { type TranslatableInterface } from "../../translation/TranslatableInterface";
import { type PageTreePage } from "./usePageTree";

function isTranslatable(
    documentType: DocumentInterface,
): documentType is DocumentInterface & TranslatableInterface & Required<Pick<DocumentInterface, "getQuery" | "updateMutation">> {
    return "translateContent" in documentType && !!documentType.getQuery && !!documentType.updateMutation;
}

interface Props {
    page: PageTreePage;
    documentType: DocumentInterface;
}

export function TranslatePageMenuItem({ page, documentType }: Props) {
    const apolloClient = useApolloClient();
    const { enabled, translate, batchTranslate } = useContentTranslationService();
    const errorDialog = useErrorDialog();
    const [translating, setTranslating] = useState(false);

    if (!enabled || !isTranslatable(documentType)) {
        return null;
    }

    const translatable = documentType;

    const handleTranslate = async () => {
        setTranslating(true);

        const effectiveBatchTranslate = batchTranslate ?? (async (texts: string[]) => Promise.all(texts.map(translate)));

        try {
            const { data: pageData } = await apolloClient.query({
                query: translatable.getQuery,
                variables: { id: page.id },
                fetchPolicy: "network-only",
            });

            const document = pageData?.page?.document;
            if (!document) {
                throw new Error("Document not found");
            }

            const { __typename: _, id, updatedAt: _updatedAt, ...documentInput } = document as GQLDocument;

            // Pass 1: Collect all translatable texts
            const collectedTexts: string[] = [];
            await translatable.translateContent(documentInput, async (text) => {
                collectedTexts.push(text);
                return text;
            });

            // Pass 2: Batch translate page name, slug, and document content together
            const allTexts = [page.name, page.slug, ...collectedTexts];
            const allTranslated = await effectiveBatchTranslate(allTexts);
            const [translatedName, translatedSlug, ...translatedTexts] = allTranslated;

            // Update the page tree node name and slug
            await apolloClient.mutate({
                mutation: updatePageTreeNodeNameMutation,
                variables: {
                    id: page.id,
                    input: { name: translatedName, slug: translatedSlug },
                },
                refetchQueries: ["Pages"],
            });

            // Pass 3: Apply translations to document content
            let textIndex = 0;
            const translatedOutput = await translatable.translateContent(documentInput, async () => {
                return translatedTexts[textIndex++];
            });

            await apolloClient.mutate({
                mutation: translatable.updateMutation,
                variables: {
                    pageId: id,
                    input: translatedOutput,
                    attachedPageTreeNodeId: page.id,
                },
                refetchQueries: [translatable.getQuery],
            });
        } catch (error) {
            errorDialog?.showError({
                title: <FormattedMessage id="comet.translateContent.error.title" defaultMessage="Translation failed" />,
                userMessage: (
                    <FormattedMessage
                        id="comet.translateContent.error.message"
                        defaultMessage="An error occurred while translating the content. Please try again."
                    />
                ),
                error: error instanceof Error ? error.message : "Translation failed",
            });
        } finally {
            setTranslating(false);
        }
    };

    return (
        <RowActionsItem icon={translating ? <CircularProgress size={16} /> : <Translate />} disabled={translating} onClick={handleTranslate}>
            <FormattedMessage id="comet.translateContent.translate" defaultMessage="Translate" />
        </RowActionsItem>
    );
}

const updatePageTreeNodeNameMutation = gql`
    mutation TranslatePageTreeNodeName($id: ID!, $input: PageTreeNodeUpdateInput!) {
        updatePageTreeNode(id: $id, input: $input) {
            id
            name
        }
    }
`;
