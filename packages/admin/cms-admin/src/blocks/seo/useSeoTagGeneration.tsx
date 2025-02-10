import { gql, useApolloClient } from "@apollo/client";
import { useErrorDialog } from "@comet/admin";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { useDocumentContentGenerationApi } from "../../documents/DocumentContentGenerationContext";
import { GQLGenerateSeoTagsMutation, GQLGenerateSeoTagsMutationVariables } from "./useSeoTagGeneration.generated";

let seoTagsCache: GQLGenerateSeoTagsMutation["generateSeoTags"] & { content: string } = {
    content: "",
    htmlTitle: "",
    metaDescription: "",
    openGraphTitle: "",
    openGraphDescription: "",
};

let pendingRequest: { content: string; request: Promise<GQLGenerateSeoTagsMutation["generateSeoTags"]> } | undefined;

export function useSeoTagGeneration() {
    const documentContentGenerationApi = useDocumentContentGenerationApi();
    const errorDialog = useErrorDialog();
    const apolloClient = useApolloClient();

    const getSeoTag = useCallback(
        async (content: string): Promise<GQLGenerateSeoTagsMutation["generateSeoTags"]> => {
            const { data, errors } = await apolloClient.mutate<GQLGenerateSeoTagsMutation, GQLGenerateSeoTagsMutationVariables>({
                mutation: generateSeoTagsMutation,
                variables: { content },
            });

            if (errors || !data?.generateSeoTags) {
                errorDialog?.showError({
                    title: (
                        <FormattedMessage id="comet.blocks.seo.generateSeoTags.errors.failed.title" defaultMessage="Failed to generate SEO tags" />
                    ),
                    userMessage: (
                        <FormattedMessage
                            id="comet.blocks.seo.generateSeoTags.errors.failed.message"
                            defaultMessage="An error occurred while generating SEO tags. Please try again."
                        />
                    ),
                    error: errors ? errors[0].message : "Failed to generate SEO tags",
                });
                throw new Error("Failed to generate SEO tags");
            }

            return data.generateSeoTags;
        },
        [apolloClient, errorDialog],
    );

    // During each generateSeoTag request, all tags are generated and cached. The cache makes responses quicker by avoiding unnecessary requests and saves LLM tokens.
    const generateSeoTag = useCallback(
        async (tag: SeoFields, currentValue: string | undefined): Promise<string> => {
            const content = documentContentGenerationApi?.seoBlock?.getDocumentContent().join(" ");

            if (!content || content.length === 0) {
                errorDialog?.showError({
                    title: (
                        <FormattedMessage id="comet.blocks.seo.generateSeoTags.errors.noContent.title" defaultMessage="No content for generation" />
                    ),
                    userMessage: (
                        <FormattedMessage
                            id="comet.blocks.seo.generateSeoTags.errors.noContent.message"
                            defaultMessage="This document contains no content that can be used to generate SEO information. Please add content and try again."
                        />
                    ),
                    error: "No content to generate SEO tags from",
                });
                throw new Error("No content to generate SEO tags from");
            }

            const cacheForTagExists = !!seoTagsCache[tag];
            const currentValueDoesntEqualCachedValue = currentValue !== seoTagsCache[tag];
            const currentContentEqualsCachedContent = content === seoTagsCache.content;

            if (cacheForTagExists && currentValueDoesntEqualCachedValue && currentContentEqualsCachedContent) {
                return seoTagsCache[tag];
            }

            if (pendingRequest && pendingRequest.content === content) {
                return pendingRequest.request.then((seoTags) => {
                    return seoTags[tag];
                });
            }

            const request = getSeoTag(content);
            pendingRequest = { request, content };

            return request.then((seoTags) => {
                pendingRequest = undefined;
                seoTagsCache = { content, ...seoTags };
                return seoTags[tag];
            });
        },
        [documentContentGenerationApi?.seoBlock, errorDialog, getSeoTag],
    );

    return generateSeoTag;
}

export const generateSeoTagsMutation = gql`
    mutation GenerateSeoTags($content: String!) {
        generateSeoTags(content: $content) {
            htmlTitle
            metaDescription
            openGraphTitle
            openGraphDescription
        }
    }
`;

export type SeoFields = "htmlTitle" | "metaDescription" | "openGraphTitle" | "openGraphDescription";

// only used for tests
export function _resetSeoTagsCache() {
    seoTagsCache = {
        content: "",
        htmlTitle: "",
        metaDescription: "",
        openGraphTitle: "",
        openGraphDescription: "",
    };
    pendingRequest = undefined;
}
