import { gql, useApolloClient } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import { readClipboard } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import slugify from "slugify";

import { useContentScope } from "../../contentScope/Provider";
import { GQLPageQuery, GQLPageQueryVariables, GQLUpdatePageMutation, GQLUpdatePageMutationVariables } from "../../documents/types";
import { useLocale } from "../../locale/useLocale";
import { GQLUpdatePageNodeMutation, GQLUpdatePageNodeMutationVariables } from "../createEditPageNode.generated";
import { convertCsvToTextContents } from "./convertCsvToTextContents";
import { GQLPageTreePageFragment } from "./usePageTree.generated";
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

const transformToSlug = (name: string, locale: string) => {
    let slug = slugify(name, { replacement: "-", lower: true, locale });
    // Remove everything except unreserved characters and percent encoding (https://tools.ietf.org/html/rfc3986#section-2.1)
    // This is necessary because slugify does not remove all reserved characters per default (e.g. "@")
    slug = slug.replace(/[^a-zA-Z0-9-._~]/g, "");
    return slug;
};

interface UseExtractPagesApi {
    /**
     * Iterates over passed pages synchronous and extracts contents
     *
     * Process:
     *      1. traverses the tree with top-down strategy
     *          1a. documents and blocks return their translatable text contents
     *      2. returns stringified JSON including all extracted text contents
     *
     * @param flatPagesTree
     */
    extractContents: (pages: GQLPageTreePageFragment[]) => Promise<string[]>;

    /**
     * Iterates over passed pages synchronous and updates data with mutations
     *
     * Process:
     *      1. traverses the tree with top-down strategy
     *          1a. documents and blocks replace old content in their state with new content
     *          1b. updates Page
     *          1c. updates Page Node
     *
     * @param flatPagesTree
     * @param contents parsed contents data from clipboard
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
    const { scope } = useContentScope();
    const locale = useLocale({ scope });

    const extractContents = React.useCallback(
        async (pages: GQLPageTreePageFragment[]): Promise<string[]> => {
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
                            const { data, error } = await client.query<GQLPageQuery, GQLPageQueryVariables>({
                                query,
                                variables: {
                                    id: page.id,
                                },
                                context: LocalErrorScopeApolloContext,
                            });

                            if (error) {
                                throw new Error(`Error while fetching page`);
                            }

                            textContents.push(page.name, page.slug);

                            if (data?.page?.document) {
                                const extractedContent = documentType.extractTextContents?.(data.page.document);
                                textContents.push(...(extractedContent ?? []));
                            }
                        }
                    } catch (e) {
                        throw new Error(`Error while fetching page`);
                    }
                }),
            );

            return Array.from(new Set(textContents.filter((content) => content && content !== "")));
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
                            const { data, error } = await client.query<GQLPageQuery, GQLPageQueryVariables>({
                                query,
                                variables: {
                                    id: page.id,
                                },
                                context: LocalErrorScopeApolloContext,
                            });

                            if (error) {
                                throw new Error(`Error while fetching page`);
                            }

                            if (data?.page?.document) {
                                const documentWithUpdateContents = documentType.replaceTextContents?.(data.page.document, content.contents);

                                if (documentWithUpdateContents && documentType.updateMutation && documentType.inputToOutput) {
                                    const { errors } = await client.mutate<GQLUpdatePageMutation, GQLUpdatePageMutationVariables>({
                                        mutation: documentType.updateMutation,
                                        variables: {
                                            pageId: data.page.document.id,
                                            input: documentWithUpdateContents,
                                            attachedPageTreeNodeId: page.id,
                                        },
                                        context: LocalErrorScopeApolloContext,
                                    });

                                    if (errors) {
                                        throw new Error(`Error while updating document`);
                                    }
                                }
                            }

                            const importedName = content.contents.find((item) => item.original === page.name)?.replaceWith;
                            const importedSlug = content.contents.find((item) => item.original === page.slug)?.replaceWith.toLowerCase();

                            if (importedName !== page.name || importedSlug !== page.slug) {
                                const attachedDocument: { id?: string; type: string } = { type: page.documentType };

                                if (data.page?.document) {
                                    attachedDocument.id = data.page?.document.id;
                                }

                                const { errors } = await client.mutate<GQLUpdatePageNodeMutation, GQLUpdatePageNodeMutationVariables>({
                                    mutation: updatePageNodeMutation,
                                    variables: {
                                        nodeId: page.id,
                                        input: {
                                            name: importedName && importedName !== "" ? importedName : page.name,
                                            slug:
                                                importedSlug && importedSlug !== "" ? transformToSlug(importedSlug ?? page.slug, locale) : page.slug,
                                            attachedDocument,
                                        },
                                    },
                                    context: LocalErrorScopeApolloContext,
                                });

                                if (errors) {
                                    throw new Error(`Error while updating page`);
                                }
                            }
                        }
                    } catch (e) {
                        throw new Error(`Error while fetching page`);
                    }
                }),
            );
        },
        [client, documentTypes, locale],
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
            const parsedText = convertCsvToTextContents(text);

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
                            id="comet.pages.cannotPasteContent.messageFailedToParseClipboard"
                            defaultMessage="Content from clipboard isn't valid document/block content"
                        />
                    ),
                };
            }
        } catch (e) {
            return {
                canPaste: false,
                error: (
                    <FormattedMessage
                        id="comet.pages.cannotPasteContent.messageFailedToParseClipboard"
                        defaultMessage="Content from clipboard isn't valid document/block content"
                    />
                ),
            };
        }
    };

    return { extractContents, importContents, getContentsFromClipboard };
}

export { useExtractImportPages };
