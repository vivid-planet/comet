import { gql, previewParams } from "@comet/cms-site";
import { ExternalLinkBlockData, InternalLinkBlockData, RedirectsLinkBlockData } from "@src/blocks.generated";
import { documentTypes } from "@src/documents";
import { GQLPageTreeNodeScope } from "@src/graphql.generated";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { notFound, redirect } from "next/navigation";

import { GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables } from "./page.generated";

const documentTypeQuery = gql`
    query DocumentType(
        $skipPage: Boolean!
        $path: String!
        $scope: PageTreeNodeScopeInput!
        $redirectSource: String!
        $redirectScope: RedirectScopeInput!
    ) {
        pageTreeNodeByPath(path: $path, scope: $scope) @skip(if: $skipPage) {
            id
            documentType
        }
        redirectBySource(source: $redirectSource, sourceType: path, scope: $redirectScope) {
            target
        }
    }
`;

export default async function Page({ params }: { params: { path: string[]; domain: string; language: string } }) {
    const { previewData } = (await previewParams()) || { previewData: undefined };
    const graphqlFetch = createGraphQLFetch(previewData);
    const siteConfig = getSiteConfigForDomain(params.domain);

    // Redirects are scoped by domain only, not by language.
    // If the language param isn't a valid language, it may still be the first segment of a redirect source.
    // In that case we skip resolving page and only check if the path is a redirect source.
    const skipPage = !siteConfig.scope.languages.includes(params.language);
    const path = `/${(params.path ?? []).join("/")}`;
    const scope = { domain: params.domain, language: params.language };

    //fetch documentType
    const data = await graphqlFetch<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(documentTypeQuery, {
        skipPage,
        path,
        scope,
        redirectSource: `/${params.language}${path !== "/" ? path : ""}`,
        redirectScope: { domain: scope.domain },
    });

    if (!data.pageTreeNodeByPath?.documentType) {
        if (data.redirectBySource?.target) {
            const target = data.redirectBySource?.target as RedirectsLinkBlockData;
            let destination: string | undefined;
            if (target.block !== undefined) {
                switch (target.block.type) {
                    case "internal": {
                        const internalLink = target.block.props as InternalLinkBlockData;
                        if (internalLink.targetPage) {
                            destination = `/${(internalLink.targetPage.scope as GQLPageTreeNodeScope).language}/${internalLink.targetPage.path}`;
                        }
                        break;
                    }
                    case "external":
                        destination = (target.block.props as ExternalLinkBlockData).targetUrl;
                        break;
                }
            }
            if (destination) {
                redirect(destination);
            }
        }
        notFound();
    }

    const pageTreeNodeId = data.pageTreeNodeByPath.id;

    const props = {
        pageTreeNodeId,
        scope,
    };

    const { component: Component } = documentTypes[data.pageTreeNodeByPath.documentType];

    return <Component {...props} />;
}

export async function generateStaticParams() {
    return [];
}
