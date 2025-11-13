import { createWriteStream } from "fs";
import { gql } from "graphql-request/dist";
import { resolve } from "path";
import { SitemapStream } from "sitemap";

import { SeoBlockData } from "../../../src/blocks.generated";
import createGraphQLClient from "../../../src/util/createGraphQLClient";
import createPublicGeneratedDirectory from "./createPublicGeneratedDirectory";
import { GQLSitemapPageDataQuery, GQLSitemapPageDataQueryVariables } from "./sitemap.xml.generated";

const sitemapPageDataQuery = gql`
    query SitemapPageData($contentScope: PageTreeNodeScopeInput!) {
        pageTreeNodeList(scope: $contentScope) {
            id
            path
            documentType
            document {
                __typename
                ... on DocumentInterface {
                    id
                }
                ... on Page {
                    updatedAt
                    seo
                }
                ... on Link {
                    updatedAt
                }
            }
        }
    }
`;

const sitemapXml = async () => {
    const generatedDirectory = createPublicGeneratedDirectory();
    const filePath = `${generatedDirectory}sitemap.xml`;
    console.log("Start generating sitemap", process.env.API_URL_INTERNAL);

    if (!process.env.API_URL_INTERNAL) {
        throw new Error("API_URL_INTERNAL not set as environment variable");
    }
    const smStream = new SitemapStream({
        hostname: process.env.SITE_URL,
        xmlns: {
            news: false,
            xhtml: false,
            image: false,
            video: false,
        },
    });

    smStream.pipe(createWriteStream(resolve(filePath)));

    const domain = process.env.NEXT_PUBLIC_SITE_PAGES_DOMAIN ?? "";
    const languages = process.env.NEXT_PUBLIC_SITE_LANGUAGES?.split(",") ?? [];
    const defaultLanguage = process.env.NEXT_PUBLIC_SITE_DEFAULT_LANGUAGE ?? "";

    // TODO: paging?
    let siteMapEntryCreated = false;

    for (const language of languages) {
        const { pageTreeNodeList } = await createGraphQLClient().request<GQLSitemapPageDataQuery, GQLSitemapPageDataQueryVariables>(
            sitemapPageDataQuery,
            { contentScope: { domain, language } },
        );
        for (const pageTreeNode of pageTreeNodeList) {
            let path: string;

            if (language === defaultLanguage) {
                path = pageTreeNode.path;
            } else {
                path = pageTreeNode.path === "/" ? `/${language}` : `/${language}${pageTreeNode.path}`;
            }

            try {
                if (pageTreeNode.document?.__typename === "Page") {
                    const seoBlockFragment: SeoBlockData = pageTreeNode.document.seo;

                    if (!seoBlockFragment.noIndex) {
                        console.log(`+ add page to sitemap: ${path}`);
                        smStream.write({
                            url: path,
                            priority: Number(seoBlockFragment.priority.replace("_", ".")),
                            changefreq: seoBlockFragment.changeFrequency,
                            lastmod: pageTreeNode.document.updatedAt,
                        });
                        siteMapEntryCreated = true;
                    } else {
                        console.log(`(skip add page to sitemap: ${path} because of no index)`);
                    }
                } else if (pageTreeNode.document?.__typename === "Link") {
                    console.log(`(skip add link to sitemap: ${path})`);
                }
            } catch (e) {
                console.error(e);
                console.error(`⛔️  Error adding page ${path} to sitemap`);
            }
        }
    }

    if (siteMapEntryCreated) {
        smStream.end();
    }

    console.log(`✅ Successfully created sitemap.xml: ${filePath}`);
};

export default sitemapXml;
