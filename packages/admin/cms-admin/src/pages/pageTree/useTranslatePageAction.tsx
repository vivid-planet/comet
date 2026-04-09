import { useApolloClient } from "@apollo/client";
import { Button, Dialog, RowActionsItem, useContentTranslationService, useErrorDialog } from "@comet/admin";
import { Translate } from "@comet/admin-icons";
import { CircularProgress, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { type ReactNode, useState } from "react";
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

export function useTranslatePageAction({ page, documentType }: Props): { menuItem: ReactNode; dialog: ReactNode } {
    const apolloClient = useApolloClient();
    const { enabled, translate, batchTranslate } = useContentTranslationService();
    const errorDialog = useErrorDialog();
    const [translating, setTranslating] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    if (!enabled || !isTranslatable(documentType)) {
        return { menuItem: null, dialog: null };
    }

    const translatable = documentType;

    const handleTranslate = async () => {
        setConfirmDialogOpen(false);
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

            if (collectedTexts.length === 0) {
                return;
            }

            // Pass 2: Batch translate
            const translatedTexts = await effectiveBatchTranslate(collectedTexts);

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

    const menuItem = (
        <RowActionsItem
            key="translate"
            icon={translating ? <CircularProgress size={16} /> : <Translate />}
            disabled={translating}
            onClick={() => setConfirmDialogOpen(true)}
        >
            <FormattedMessage id="comet.translateContent.translate" defaultMessage="Translate" />
        </RowActionsItem>
    );

    const dialog = (
        <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            title={<FormattedMessage id="comet.translateContent.confirmDialog.title" defaultMessage="Translate page content?" />}
        >
            <DialogContent>
                <DialogContentText>
                    <FormattedMessage
                        id="comet.translateContent.confirmDialog.message"
                        defaultMessage="All text content of this page will be translated. This action cannot be reverted."
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setConfirmDialogOpen(false)} variant="textDark">
                    <FormattedMessage id="comet.translateContent.confirmDialog.cancel" defaultMessage="Cancel" />
                </Button>
                <Button onClick={handleTranslate} variant="primary">
                    <FormattedMessage id="comet.translateContent.confirmDialog.confirm" defaultMessage="Translate" />
                </Button>
            </DialogActions>
        </Dialog>
    );

    return { menuItem, dialog };
}
