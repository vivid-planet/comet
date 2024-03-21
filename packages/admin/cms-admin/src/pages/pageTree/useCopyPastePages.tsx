import { useApolloClient } from "@apollo/client";
import { LocalErrorScopeApolloContext, messages, readClipboardText, useErrorDialog, writeClipboardText } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useCmsBlockContext } from "../../blocks/useCmsBlockContext";
import { ContentScopeInterface, useContentScope } from "../../contentScope/Provider";
import { useDamScope } from "../../dam/config/useDamScope";
import { GQLDocument, GQLPageQuery, GQLPageQueryVariables } from "../../documents/types";
import { useProgressDialog } from "./useCopyPastePages/ProgressDialog";
import { sendPages, SendPagesOptions } from "./useCopyPastePages/sendPages";
import { GQLPageTreePageFragment } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

export type PageClipboard = GQLPageTreePageFragment & { document?: GQLDocument | null };

export interface PagesClipboard {
    pages: PageClipboard[];
    scope: ContentScopeInterface;
}

/**
 * Typeguard to check if an object is a PagesClipboard Type
 * @param pagesClipboard
 */
function isPagesClipboard(pagesClipboard: PagesClipboard): pagesClipboard is PagesClipboard {
    return (pagesClipboard as PagesClipboard).pages !== undefined;
}

/**
 * Union return type from `getFromClipboard` function.
 * The union discriminator `canPaste` returns either a PagesClipboard data if it could be parsed, otherwise an localized error in form of a ReactNode
 */
type GetFromClipboardResponse = { canPaste: true; content: PagesClipboard } | { canPaste: false; error: React.ReactNode };

interface UseCopyPastePagesApi {
    /**
     * parallel fetches missing document data and prepares data for clipboard.
     * @param flatPagesTree
     */
    prepareForClipboard: (pages: GQLPageTreePageFragment[]) => Promise<PagesClipboard>;

    /**
     * writes pages to the clipboard.
     * @param pages Use `prepareForClipboard` function to generate this kind of type
     */
    writeToClipboard: (pages: PagesClipboard) => Promise<void>;

    /**
     * read data from clipboard, validate it and return parsed data.
     */
    getFromClipboard: () => Promise<GetFromClipboardResponse>;

    /**
     * @param parentId Parent Id where the paste should be attached to
     * @param pages all pages which should be pasted
     * @param options customize where the pages are pasted
     */
    sendPages: (parentId: string | null, pages: PagesClipboard, options: SendPagesOptions) => Promise<void>;

    progressDialog: React.ReactNode;
}

/**
 * This hooks provides some helper functions to copy / paste Pages and PageTreeNodes
 */
function useCopyPastePages(): UseCopyPastePagesApi {
    const { documentTypes, currentCategory } = usePageTreeContext();
    const client = useApolloClient();
    const { scope } = useContentScope();
    const damScope = useDamScope();
    const blockContext = useCmsBlockContext();
    const progress = useProgressDialog({ title: <FormattedMessage id="comet.pages.insertingPages" defaultMessage="Inserting pages" /> });
    const errorDialog = useErrorDialog();

    const prepareForClipboard = React.useCallback(
        async (pages: GQLPageTreePageFragment[]): Promise<PagesClipboard> => {
            const pagesWithDocuments: Array<PageClipboard> = [];

            await Promise.all(
                pages.map(async (page) => {
                    const documentType = documentTypes[page.documentType];

                    if (!documentType) {
                        throw new Error(`Unknown document type "${documentType}"`);
                    }

                    try {
                        const query = documentType.getQuery;

                        if (query) {
                            const { data } = await client.query<GQLPageQuery, GQLPageQueryVariables>({
                                query,
                                variables: {
                                    id: page.id,
                                },
                                context: LocalErrorScopeApolloContext,
                            });

                            const clipboardPage: PageClipboard = { ...page, document: data?.page?.document };
                            pagesWithDocuments.push(clipboardPage);
                        }
                    } catch (e) {
                        throw new Error(`Error while fetching page`);
                    }
                }),
            );

            const clipboardPages: PagesClipboard = {
                pages: [...pagesWithDocuments],
                scope,
            };
            return clipboardPages;
        },
        [client, documentTypes, scope],
    );
    const writeToClipboard = React.useCallback(async (pages: PagesClipboard) => {
        return writeClipboardText(JSON.stringify(pages));
    }, []);

    const getFromClipboard = async (): Promise<GetFromClipboardResponse> => {
        const text = await readClipboardText();

        if (text === undefined) {
            return {
                canPaste: false,
                error: (
                    <FormattedMessage
                        id="comet.pages.cannotPastePage.messageFailedToReadClipboard"
                        defaultMessage="Can't read clipboard content. Please make sure that clipboard access is given"
                    />
                ),
            };
        }

        if (text.trim() === "") {
            return {
                canPaste: false,
                error: <FormattedMessage id="comet.pages.cannotPastePage.messageEmptyClipboard" defaultMessage="Clipboard is empty" />,
            };
        }

        try {
            const parsedText = JSON.parse(text);
            if (isPagesClipboard(parsedText)) {
                return { canPaste: true, content: parsedText };
            } else {
                return {
                    canPaste: false,
                    error: (
                        <FormattedMessage
                            id="comet.pages.cannotPasteBlock.messageFailedToParseClipboard"
                            defaultMessage="Content from clipboard aren't valid blocks"
                        />
                    ),
                };
            }
        } catch (e) {
            return {
                canPaste: false,
                error: (
                    <FormattedMessage
                        id="comet.pages.cannotPasteBlock.messageFailedToParseClipboard"
                        defaultMessage="Content from clipboard aren't valid blocks"
                    />
                ),
            };
        }
    };

    const updateProgress = progress.updateProgress;
    const sendPagesCb = React.useCallback(
        async (parentId: string | null, pages: PagesClipboard, options: SendPagesOptions) => {
            try {
                await sendPages(parentId, pages, options, { client, scope, documentTypes, blockContext, damScope, currentCategory }, updateProgress);
            } catch (e) {
                errorDialog?.showError({
                    title: <FormattedMessage {...messages.error} />,
                    userMessage: (
                        <FormattedMessage id="comet.pages.cannotPastePage" defaultMessage="An unexpected error occured when pasting pages." />
                    ),
                    error: String(e),
                });
            } finally {
                updateProgress(undefined); //hides progress dialog
            }
        },
        [client, scope, documentTypes, blockContext, damScope, currentCategory, updateProgress, errorDialog],
    );

    return {
        prepareForClipboard,
        writeToClipboard,
        getFromClipboard,
        sendPages: sendPagesCb,
        progressDialog: progress.dialog,
    };
}

export { useCopyPastePages };
