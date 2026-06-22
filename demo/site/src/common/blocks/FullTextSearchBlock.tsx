"use client";
import { gql, type PropsWithData, withPreview } from "@comet/site-nextjs";
import type { FullTextSearchBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { createSitePath } from "@src/util/createSitePath";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import type { GQLFullTextSearchQuery, GQLFullTextSearchQueryVariables } from "./FullTextSearchBlock.generated";
import styles from "./FullTextSearchBlock.module.scss";

const fullTextSearchQuery = gql`
    query FullTextSearch($search: String!, $scope: JSONObject!) {
        siteFullTextSearch(search: $search, scope: $scope) {
            nodes {
                id
                entityName
                name
                secondaryInformation
            }
            totalCount
        }
    }
`;

type SearchResult = GQLFullTextSearchQuery["siteFullTextSearch"]["nodes"][number];

const debounceMilliseconds = 300;

// Search results carry no target URL (see EntityInfo), so the path is derived from the entity type.
// `secondaryInformation` holds the routing key: the page-tree path for pages and the slug for news.
function getSearchResultPath(result: SearchResult): string | undefined {
    if (!result.secondaryInformation) {
        return undefined;
    }

    switch (result.entityName) {
        case "PageTreeNode":
            return `/${result.secondaryInformation}`;
        case "News":
            return `/news/${result.secondaryInformation}`;
        default:
            return undefined;
    }
}

export const FullTextSearchBlock = withPreview(
    (_props: PropsWithData<FullTextSearchBlockData>) => {
        const intl = useIntl();
        const params = useParams<{ domain: string; language: string }>();
        const domain = params?.domain;
        const language = params?.language;
        const [query, setQuery] = useState("");
        const [results, setResults] = useState<SearchResult[]>([]);
        const [totalCount, setTotalCount] = useState(0);
        const [isLoading, setIsLoading] = useState(false);
        const [hasSearched, setHasSearched] = useState(false);

        useEffect(() => {
            const search = query.trim();

            if (search.length === 0) {
                setResults([]);
                setTotalCount(0);
                setHasSearched(false);
                setIsLoading(false);
                return;
            }

            let isCurrent = true;
            setIsLoading(true);

            const timeout = setTimeout(async () => {
                const graphQLFetch = createGraphQLFetch();
                try {
                    const { siteFullTextSearch } = await graphQLFetch<GQLFullTextSearchQuery, GQLFullTextSearchQueryVariables>(fullTextSearchQuery, {
                        search,
                        scope: { domain, language },
                    });

                    if (isCurrent) {
                        setResults(siteFullTextSearch.nodes);
                        setTotalCount(siteFullTextSearch.totalCount);
                        setHasSearched(true);
                    }
                } finally {
                    if (isCurrent) {
                        setIsLoading(false);
                    }
                }
            }, debounceMilliseconds);

            return () => {
                isCurrent = false;
                clearTimeout(timeout);
            };
        }, [query, domain, language]);

        return (
            <PageLayout grid>
                <div className={styles.root}>
                    <input
                        type="search"
                        className={styles.input}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={intl.formatMessage({ id: "fullTextSearch.placeholder", defaultMessage: "Search…" })}
                        aria-label={intl.formatMessage({ id: "fullTextSearch.placeholder", defaultMessage: "Search…" })}
                    />

                    {isLoading && (
                        <p className={styles.status}>
                            <FormattedMessage id="fullTextSearch.loading" defaultMessage="Searching…" />
                        </p>
                    )}

                    {!isLoading && hasSearched && results.length === 0 && (
                        <p className={styles.status}>
                            <FormattedMessage id="fullTextSearch.noResults" defaultMessage="No results found." />
                        </p>
                    )}

                    {results.length > 0 && (
                        <>
                            <p className={styles.status}>
                                <FormattedMessage
                                    id="fullTextSearch.resultCount"
                                    defaultMessage="{totalCount, plural, one {# result} other {# results}}"
                                    values={{ totalCount }}
                                />
                            </p>
                            <ul className={styles.list}>
                                {results.map((result) => {
                                    const showSecondaryInformation =
                                        result.secondaryInformation && result.secondaryInformation.toLowerCase() !== result.name.toLowerCase();

                                    const path = getSearchResultPath(result);
                                    const href = path && language ? createSitePath({ path, scope: { language } }) : undefined;

                                    const content = (
                                        <>
                                            <span className={styles.name}>{result.name}</span>
                                            {showSecondaryInformation && (
                                                <span className={styles.secondaryInformation}>{result.secondaryInformation}</span>
                                            )}
                                        </>
                                    );

                                    return (
                                        <li key={`${result.entityName}-${result.id}`} className={styles.listItem}>
                                            {href ? (
                                                <Link href={href} className={`${styles.result} ${styles.link}`}>
                                                    {content}
                                                </Link>
                                            ) : (
                                                <div className={styles.result}>{content}</div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}
                </div>
            </PageLayout>
        );
    },
    { label: "Full Text Search" },
);
