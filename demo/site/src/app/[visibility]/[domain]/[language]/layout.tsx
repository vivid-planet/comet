import { gql, JsonLd } from "@comet/site-nextjs";
import { Footer } from "@src/layout/footer/Footer";
import { footerFragment } from "@src/layout/footer/Footer.fragment";
import { Header } from "@src/layout/header/Header";
import { headerFragment } from "@src/layout/header/Header.fragment";
import { TopNavigation } from "@src/layout/topNavigation/TopNavigation";
import { topMenuPageTreeNodeFragment } from "@src/layout/topNavigation/TopNavigation.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { IntlProvider } from "@src/util/IntlProvider";
import { loadMessages } from "@src/util/loadMessages";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { setNotFoundContext } from "@src/util/ServerContext";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { buildOrganization } from "@src/util/structuredData/buildOrganization";
import { siteSettingsFragment } from "@src/util/structuredData/SiteSettings.fragment";
import type { Metadata } from "next";
import type { Organization } from "schema-dts";

import type { GQLLayoutQuery, GQLLayoutQueryVariables } from "./layout.generated";

export default async function Layout({ children, params }: LayoutProps<"/[visibility]/[domain]/[language]">) {
    const { domain, language: languageParam } = await params;
    const siteConfig = getSiteConfigForDomain(domain);

    let language = languageParam;

    if (!siteConfig.scope.languages.includes(language)) {
        language = "en";
    }
    setNotFoundContext({ domain, language });

    const graphQLFetch = createGraphQLFetch();

    const { footer, header, topMenu, siteSettings } = await graphQLFetch<GQLLayoutQuery, GQLLayoutQueryVariables>(
        gql`
            query Layout($domain: String!, $language: String!) {
                footer: footer(scope: { domain: $domain, language: $language }) {
                    ...Footer
                }
                header: mainMenu(scope: { domain: $domain, language: $language }) {
                    ...Header
                }
                topMenu(scope: { domain: $domain, language: $language }) {
                    ...TopMenuPageTreeNode
                }
                siteSettings(scope: { domain: $domain, language: $language }) {
                    ...SiteSettings
                }
            }

            ${footerFragment}
            ${headerFragment}
            ${topMenuPageTreeNodeFragment}
            ${siteSettingsFragment}
        `,
        { domain, language },
    );

    const messages = await loadMessages(language);

    if (footer) {
        footer.content = await recursivelyLoadBlockData({
            blockData: footer.content,
            blockType: "FooterContent",
            graphQLFetch,
            fetch,
            scope: { domain, language },
        });
    }

    let organization: ReturnType<typeof buildOrganization> = null;

    if (siteSettings) {
        siteSettings.content = await recursivelyLoadBlockData({
            blockData: siteSettings.content,
            blockType: "SiteSettingsContent",
            graphQLFetch,
            fetch,
            scope: { domain, language },
        });
        organization = buildOrganization(siteSettings.content, siteConfig.url);
    }

    return (
        <IntlProvider locale={language} messages={messages}>
            {organization && <JsonLd<Organization> data={organization} />}
            <TopNavigation data={topMenu} />
            <Header header={header} />
            {children}
            {footer && <Footer footer={footer} />}
        </IntlProvider>
    );
}

export async function generateMetadata({ params }: LayoutProps<"/[visibility]/[domain]/[language]">): Promise<Metadata> {
    const { domain } = await params;
    const siteConfig = getSiteConfigForDomain(domain);

    return {
        metadataBase: new URL(siteConfig.url),
    };
}
