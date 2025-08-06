import { graphql } from "@src/gql";
import { Footer } from "@src/layout/footer/Footer";
import { Header } from "@src/layout/header/Header";
import { TopNavigation } from "@src/layout/topNavigation/TopNavigation";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { IntlProvider } from "@src/util/IntlProvider";
import { loadMessages } from "@src/util/loadMessages";
import { setNotFoundContext } from "@src/util/ServerContext";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import type { Metadata } from "next";
import { type PropsWithChildren } from "react";

interface LayoutProps {
    params: { domain: string; language: string };
}

const query = graphql(`
    query Layout($domain: String!, $language: String!) {
        header: mainMenu(scope: { domain: $domain, language: $language }) {
            ...Header
        }
        topMenu(scope: { domain: $domain, language: $language }) {
            ...TopMenuPageTreeNode
        }
        footer: footer(scope: { domain: $domain, language: $language }) {
            ...Footer
        }
    }
`);

export default async function Layout({ children, params: { domain, language } }: PropsWithChildren<LayoutProps>) {
    const siteConfig = getSiteConfigForDomain(domain);
    if (!siteConfig.scope.languages.includes(language)) {
        language = "en";
    }
    setNotFoundContext({ domain, language });

    const graphqlFetch = createGraphQLFetch();

    const { header, topMenu, footer } = await graphqlFetch(query, { domain, language });

    const messages = await loadMessages(language);

    return (
        <IntlProvider locale={language} messages={messages}>
            <TopNavigation data={topMenu} />
            <Header header={header} />
            {children}
            <Footer footer={footer} />
        </IntlProvider>
    );
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const siteConfig = getSiteConfigForDomain(params.domain);

    return {
        metadataBase: new URL(siteConfig.url),
    };
}
