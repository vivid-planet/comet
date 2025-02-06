import { gql } from "@comet/cms-site";
import { GQLLayoutQuery, GQLLayoutQueryVariables } from "@src/app/[visibility]/[domain]/[language]/[[...path]]/layout.generated";
import { Footer } from "@src/layout/footer/Footer";
import { footerFragment } from "@src/layout/footer/Footer.fragment";
import { VisibilityParam } from "@src/middleware/domainRewrite";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { setVisibilityParam } from "@src/util/ServerContext";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";

interface LayoutProps {
    params: { domain: string; language: string; visibility: VisibilityParam };
}

export default async function Layout({ children, params: { domain, language, visibility } }: PropsWithChildren<LayoutProps>) {
    setVisibilityParam(visibility);
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

    return (
        <>
            {children}
            {footer && <Footer footer={footer} />}
        </>
    );
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const siteConfig = getSiteConfigForDomain(params.domain);

    return {
        metadataBase: new URL(siteConfig.url),
    };
}
