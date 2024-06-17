import { gql, useApolloClient } from "@apollo/client";
import { ContentTranslationServiceProvider } from "@comet/admin";
import React from "react";

import { useContentScope } from "../contentScope/Provider";
import { GQLTranslateQuery, GQLTranslateQueryVariables } from "./AzureAITranslatorProvider.generated";

interface AzureAITranslatorProps extends Omit<React.ComponentProps<typeof ContentTranslationServiceProvider>, "enabled" | "translate"> {
    enabled?: boolean;
}

export const AzureAITranslatorProvider: React.FunctionComponent<AzureAITranslatorProps> = ({
    children,
    enabled = false,
    ...rest
}: React.PropsWithChildren<AzureAITranslatorProps>) => {
    const { scope } = useContentScope();
    const apolloClient = useApolloClient();

    return (
        <ContentTranslationServiceProvider
            {...rest}
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
