import { gql } from "@comet/site-react";
import { type ExternalLinkBlockData, type InternalLinkBlockData, type RedirectsLinkBlockData } from "@src/blocks.generated";
import { documentTypes } from "@src/documents";
import { type GQLPageTreeNodeScope, type GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import type { PublicSiteConfig } from "@src/site-configs";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { fetchPredefinedPages } from "@src/util/predefinedPages";
import { NotFoundError, RedirectError } from "@src/util/rscErrors";
import { match } from "path-to-regexp";

import { Layout } from "./Layout";
import { type GQLDocumentTypeQuery, type GQLDocumentTypeQueryVariables } from "./Page.generated";
import { predefinedPagesRoutes } from "./predefinedPagesRoutes";

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

interface RootProps {
    path: string;
    language: string;
    siteConfig: PublicSiteConfig;
}

export async function Root(props: RootProps) {
    const scope: GQLPageTreeNodeScopeInput = {
        domain: props.siteConfig.scope.domain,
        language: props.language,
    };
    const graphQLFetch = createGraphQLFetch();

    const predefinedPages = await fetchPredefinedPages(scope.domain, props.language);

    for (const page of predefinedPages) {
        if (props.path.startsWith(page.path)) {
            const routes = predefinedPagesRoutes[page.type];
            if (!routes) {
                throw new Error(`No routes found for predefined page type: ${page.type}`);
            }
            let subPath = props.path.replace(page.path, "");
            if (subPath === "") subPath = "/";
            for (const route of routes) {
                const matchFn = match(route.pattern);
                const result = matchFn(subPath);
                if (result) {
                    const documentProps = {
                        params: result.params,
                        scope,
                        siteConfig: props.siteConfig,
                    };

                    const Component = route.component;

                    return (
                        <Layout scope={scope}>
                            <Component {...documentProps} />
                        </Layout>
                    );
                }
            }
            throw new NotFoundError();
        }
    }

    // Redirects are scoped by domain only, not by language.
    // If the language param isn't a valid language, it may still be the first segment of a redirect source.
    // In that case we skip resolving page and only check if the path is a redirect source.
    const isValidLanguage = props.siteConfig.scope.languages.includes(scope.language);

    if (props.path === "/" && !isValidLanguage) {
        throw new RedirectError(`/en`); // redirect to language root
    }

    const data = await graphQLFetch<GQLDocumentTypeQuery, GQLDocumentTypeQueryVariables>(
        documentTypeQuery,
        {
            skipPage: !isValidLanguage,
            path: props.path,
            scope: scope,
            redirectSource: `/${scope.language}${props.path !== "/" ? props.path : ""}`,
            redirectScope: { domain: scope.domain },
        },
        { method: "GET" }, //for request memoization
    );

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
                throw new RedirectError(destination);
            }
        }
        throw new NotFoundError();
    }

    const pageTreeNodeId = data.pageTreeNodeByPath.id;

    const documentProps = {
        pageTreeNodeId,
        scope,
        siteConfig: props.siteConfig,
    };

    const { component: Component } = documentTypes[data.pageTreeNodeByPath.documentType];

    return (
        <Layout scope={scope}>
            <Component {...documentProps} />
        </Layout>
    );
}
