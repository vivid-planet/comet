import { gql, useApolloClient } from "@apollo/client";
import { ContentTranslationServiceProvider } from "@comet/admin";
// import { GQLTranslateQuery, GQLTranslateQueryVariables } from "@src/common/translation/AzureAITranslatorProvider.generated";
import React from "react";

import { useContentScope } from "../../contentScope/Provider";
import { GQLTranslateQuery, GQLTranslateQueryVariables } from "./AzureAITranslatorProvider.generated";

export const AzureAITranslatorProvider: React.FunctionComponent = ({ children }) => {
    const { scope } = useContentScope();
    const apolloClient = useApolloClient();

    return (
        <ContentTranslationServiceProvider
            enabled={true}
            translate={async function (text: string): Promise<string> {
                const { data } = await apolloClient.query<GQLTranslateQuery, GQLTranslateQueryVariables>({
                    query: translationQuery,
                    variables: {
                        input: { text, targetLanguage: scope.language },
                    },
                });
                return data.translate;
            }}
        >
            {children}
        </ContentTranslationServiceProvider>
    );
};

const translationQuery = gql`
    query Translate($input: TranslationInput!) {
        translate(input: $input)
    }
`;
