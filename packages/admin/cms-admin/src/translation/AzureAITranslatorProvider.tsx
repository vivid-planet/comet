import { gql, useApolloClient } from "@apollo/client";
import { ContentTranslationServiceProvider } from "@comet/admin";
import React from "react";

import { useContentScope } from "../contentScope/Provider";
import { GQLTranslateQuery, GQLTranslateQueryVariables } from "./AzureAITranslatorProvider.generated";

type AzureAITranslatorProps = {
    enabled?: boolean;
};

export const AzureAITranslatorProvider: React.FunctionComponent<AzureAITranslatorProps> = ({
    children,
    enabled = false,
}: React.PropsWithChildren<AzureAITranslatorProps>) => {
    const { scope } = useContentScope();
    const apolloClient = useApolloClient();

    return (
        <ContentTranslationServiceProvider
            enabled={enabled}
            translate={async function (text: string): Promise<string> {
                const { data } = await apolloClient.query<GQLTranslateQuery, GQLTranslateQueryVariables>({
                    query: translationQuery,
                    variables: {
                        input: { text, targetLanguage: scope.language },
                    },
                });
                return data.azureAiTranslate;
            }}
        >
            {children}
        </ContentTranslationServiceProvider>
    );
};

const translationQuery = gql`
    query Translate($input: TranslationInput!) {
        azureAiTranslate(input: $input)
    }
`;
