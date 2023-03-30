import { useApolloClient } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import * as React from "react";

import { GQLPageQuery, GQLPageQueryVariables } from "../../documents/types";
import { GQLPageTreePageFragment } from "../../graphql.generated";
import { usePageTreeContext } from "./usePageTreeContext";

interface UseExtractPagesApi {
    /**
     * parallel fetches missing document data and prepares data for content extraction.
     * @param flatPagesTree
     */
    prepareForExtraction: (pages: GQLPageTreePageFragment[]) => Promise<string>;
}

/**
 * This hooks provides some helper functions to extract Pages and PageTreeNodes
 */
function useExtractPages(): UseExtractPagesApi {
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

    return { prepareForExtraction };
}

export { useExtractPages };
