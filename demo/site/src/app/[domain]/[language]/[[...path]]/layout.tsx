import { gql } from "@comet/cms-site";
import { GQLLayoutQuery, GQLLayoutQueryVariables } from "@src/app/[domain]/[language]/[[...path]]/layout.generated";
import { Footer } from "@src/layout/footer/Footer";
import { footerFragment } from "@src/layout/footer/Footer.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { decodePageProps } from "@src/util/siteConfig";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
    title: "Comet Starter",
};

export default async function Layout(props: PropsWithChildren<{ params: { domain: string; language: string } }>) {
    const {
        scope: { domain, language },
        previewData,
        children,
    } = decodePageProps(props);
    const graphqlFetch = createGraphQLFetch(previewData);

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
