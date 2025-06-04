import { gql } from "@comet/site-nextjs";
import { Footer } from "@src/layout/footer/Footer";
import { footerFragment } from "@src/layout/footer/Footer.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { IntlProvider } from "@src/util/IntlProvider";
import { loadMessages } from "@src/util/loadMessages";
import { setNotFoundContext } from "@src/util/ServerContext";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { PropsWithChildren } from "react";

import { GQLLayoutQuery, GQLLayoutQueryVariables } from "./layout.generated";

export default async function Page({ children, params: { domain, language } }: PropsWithChildren<{ params: { domain: string; language: string } }>) {
    const siteConfig = getSiteConfigForDomain(domain);
    if (!siteConfig.scope.languages.includes(language)) {
        language = "en";
    }
    setNotFoundContext({ domain, language });

    const graphqlFetch = createGraphQLFetch();

    const { footer } = await graphqlFetch<GQLLayoutQuery, GQLLayoutQueryVariables>(
        gql`
            query Layout($domain: String!, $language: String!) {
                footer: footer(scope: { domain: $domain, language: $language }) {
                    ...Footer
                }
            }

            ${footerFragment}
        `,
        { domain, language },
    );

    const messages = await loadMessages(language);
    return (
        <IntlProvider locale={language} messages={messages}>
            {children}
            {footer && <Footer footer={footer} />}
        </IntlProvider>
    );
}
