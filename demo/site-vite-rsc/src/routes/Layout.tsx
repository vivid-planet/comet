import { gql } from "@comet/site-react";
import { Footer } from "@src/layout/footer/Footer";
import { footerFragment } from "@src/layout/footer/Footer.fragment";
import { Header } from "@src/layout/header/Header";
import { headerFragment } from "@src/layout/header/Header.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { type PropsWithChildren } from "react";

import { type GQLLayoutQuery, type GQLLayoutQueryVariables } from "./Layout.generated";
import { RootLayout } from "./RootLayout";

interface LayoutProps {
    scope: {
        domain: string;
        language: string;
    };
}

export async function Layout({ children, scope }: PropsWithChildren<LayoutProps>) {
    const graphqlFetch = createGraphQLFetch();
    const { header, footer } = await graphqlFetch<GQLLayoutQuery, GQLLayoutQueryVariables>(
        gql`
            query Layout($domain: String!, $language: String!) {
                header: mainMenu(scope: { domain: $domain, language: $language }) {
                    ...Header
                }
                footer: footer(scope: { domain: $domain, language: $language }) {
                    ...Footer
                }
            }
            ${headerFragment}
            ${footerFragment}
        `,
        scope,
    );

    return (
        <RootLayout scope={scope}>
            <Header header={header} />
            {children}
            {footer && <Footer footer={footer} />}
        </RootLayout>
    );
}
