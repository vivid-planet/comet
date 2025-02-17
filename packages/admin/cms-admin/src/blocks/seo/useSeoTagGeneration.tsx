import { gql, useApolloClient } from "@apollo/client";
import { LocalErrorScopeApolloContext, useErrorDialog } from "@comet/admin";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { useContentGenerationConfig } from "../../documents/ContentGenerationConfigContext";
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
    const contentGenerationConfig = useContentGenerationConfig();
    const errorDialog = useErrorDialog();
    const apolloClient = useApolloClient();

    const getSeoTags = useCallback(
        async (content: string): Promise<GQLGenerateSeoTagsMutation["generateSeoTags"]> => {
            const { data, errors } = await apolloClient.mutate<GQLGenerateSeoTagsMutation, GQLGenerateSeoTagsMutationVariables>({
                mutation: generateSeoTagsMutation,
                variables: { content },
                context: LocalErrorScopeApolloContext,
                errorPolicy: "all",
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
        async (tag: SeoTag, currentValue: string | undefined): Promise<string> => {
            const content = contentGenerationConfig?.seo?.getRelevantContent().join(" ");

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
                return "";
            }

            const cacheForTagExists = !!seoTagsCache[tag];
            const currentValueDoesntEqualCachedValue = currentValue !== seoTagsCache[tag];
            const currentContentEqualsCachedContent = content === seoTagsCache.content;

            if (cacheForTagExists && currentValueDoesntEqualCachedValue && currentContentEqualsCachedContent) {
                return seoTagsCache[tag];
            }

            let seoTags: GQLGenerateSeoTagsMutation["generateSeoTags"];

            if (pendingRequest && pendingRequest.content === content) {
                try {
                    seoTags = await pendingRequest.request;
                } catch {
                    return "";
                }
                return seoTags[tag];
            }

            const request = getSeoTags(content);
            pendingRequest = { request, content };

            try {
                seoTags = await request;
            } catch (err) {
                console.error(err);
                pendingRequest = undefined;
                return "";
            }

            pendingRequest = undefined;
            seoTagsCache = { content, ...seoTags };
            return seoTags[tag];
        },
        [contentGenerationConfig?.seo, errorDialog, getSeoTags],
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

export type SeoTag = "htmlTitle" | "metaDescription" | "openGraphTitle" | "openGraphDescription";

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
