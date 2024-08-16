import { gql, useApolloClient } from "@apollo/client";
import { ContentTranslationServiceProvider } from "@comet/admin";
import React from "react";

import { useContentScope } from "../contentScope/Provider";
import { useUserPermissionCheck } from "../userPermissions/hooks/currentUser";
import { GQLTranslateQuery, GQLTranslateQueryVariables } from "./AzureAiTranslatorProvider.generated";

interface AzureAiTranslatorProps extends Omit<React.ComponentProps<typeof ContentTranslationServiceProvider>, "enabled" | "translate"> {
    enabled?: boolean;
}

export const AzureAiTranslatorProvider = ({ children, enabled = false, ...rest }: React.PropsWithChildren<AzureAiTranslatorProps>) => {
    const { scope } = useContentScope();
    const apolloClient = useApolloClient();
    const isAllowed = useUserPermissionCheck();

    return (
        <ContentTranslationServiceProvider
            {...rest}
            enabled={enabled && isAllowed("translation")}
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
    query Translate($input: AzureAiTranslationInput!) {
        azureAiTranslate(input: $input)
    }
`;
