import { gql, useApolloClient } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import { readClipboard } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLPageQuery, GQLPageQueryVariables } from "../../documents/types";
import { GQLPageTreePageFragment, GQLUpdatePageNodeMutation, GQLUpdatePageNodeMutationVariables } from "../../graphql.generated";
import { usePageTreeContext } from "./usePageTreeContext";

interface ContentsClipboard {
    textContents: {
        [key: string]: string;
    };
}

interface ParsedContents {
    contents: {
        original: string;
        replaceWith: string;
    }[];
}
/**
 * Typeguard to check if an object is a ContentsClipboard Type
 * @param contentsClipboard
 */
function isContentsClipboard(contentsClipboard: ContentsClipboard): contentsClipboard is ContentsClipboard {
    return (contentsClipboard as ContentsClipboard).textContents !== undefined;
}

/**
 * Union return type from `getContentsFromClipboard` function.
 * The union discriminator `canPaste` returns either a ContentsClipboard data if it could be parsed, otherwise an localized error in form of a ReactNode
 */
type GetContentsFromClipboardResponse = { canPaste: true; content: ParsedContents } | { canPaste: false; error: React.ReactNode };

const updatePageNodeMutation = gql`
    mutation ImportContentsUpdatePageNode($nodeId: ID!, $input: PageTreeNodeUpdateInput!) {
        updatePageTreeNode(id: $nodeId, input: $input) {
            id
            name
            slug
        }
    }
`;

interface UseExtractPagesApi {
    /**
     * parallel fetches missing document data and prepares data for content extraction.
     * @param flatPagesTree
     */
    prepareForExtraction: (pages: GQLPageTreePageFragment[]) => Promise<string>;

    /**
     * Iterates over passed pages synchronous and updates data with mutations
     *
     * Process:
     *      1. traverses the tree with top-down strategy
     *      2. Refetch Pages query
     *
     * @param parentId Parent Id where the paste should be attached to
     * @param contents all pages which should be pasted
     */
    importContents: (pages: GQLPageTreePageFragment[], contents: ParsedContents) => Promise<void>;

    /**
     * read data from clipboard, validate it and return parsed data.
     */
    getContentsFromClipboard: () => Promise<GetContentsFromClipboardResponse>;
}

/**
 * This hooks provides some helper functions to extract Pages and PageTreeNodes
 */
function useExtractImportPages(): UseExtractPagesApi {
    const { documentTypes } = usePageTreeContext();
    const client = useApolloClient();

    const prepareForExtraction = React.useCallback(
        async (pages: GQLPageTreePageFragment[]): Promise<string> => {
            const textContents: string[] = [];

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

                            if (data?.page?.document) {
                                const extractedContent = documentType.extractTextContents(data.page.document);
                                textContents.push(page.name, page.slug, ...extractedContent);
                            }
                        }
                    } catch (e) {
                        throw new Error(`Error while fetching page`);
                    }
                }),
            );

            const pageText = {
                textContents: Array.from(new Set(textContents)),
            };

            return JSON.stringify(pageText);
        },
        [client, documentTypes],
    );

    const importContents = React.useCallback(
        async (pages: GQLPageTreePageFragment[], content: ParsedContents): Promise<void> => {
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

                            if (data?.page?.document) {
                                // documentType.replaceTextContents(data.page.document, content.contents);

                                const importedName = content.contents.find((item) => item.original === page.name)?.replaceWith;

                                // TODO check characters of slug
                                const importedSlug = content.contents.find((item) => item.original === page.slug)?.replaceWith.toLowerCase();

                                await client.mutate<GQLUpdatePageNodeMutation, GQLUpdatePageNodeMutationVariables>({
                                    mutation: updatePageNodeMutation,
                                    variables: {
                                        nodeId: page.id,
                                        input: {
                                            name: importedName ?? page.name,
                                            slug: importedSlug ?? page.slug,
                                            attachedDocument: { id: data.page.document.id, type: data.page.document.__typename },
                                        },
                                    },
                                    context: LocalErrorScopeApolloContext,
                                });
                            }
                        }
                    } catch (e) {
                        throw new Error(`Error while fetching page`);
                    }
                }),
            );
        },
        [client, documentTypes],
    );

    const getContentsFromClipboard = async (): Promise<GetContentsFromClipboardResponse> => {
        const text = await readClipboard();

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
            if (isContentsClipboard(parsedText)) {
                return {
                    canPaste: true,
                    content: {
                        contents: Object.entries(parsedText.textContents).map((content) => ({ original: content[0], replaceWith: content[1] })),
                    },
                };
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

    return { prepareForExtraction, importContents, getContentsFromClipboard };
}

export { useExtractImportPages as useExtractPages };
