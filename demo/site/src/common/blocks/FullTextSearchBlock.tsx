"use client";
import { gql, type PropsWithData, withPreview } from "@comet/site-nextjs";
import type { FullTextSearchBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import type { GQLFullTextSearchQuery, GQLFullTextSearchQueryVariables } from "./FullTextSearchBlock.generated";
import styles from "./FullTextSearchBlock.module.scss";

const fullTextSearchQuery = gql`
    query FullTextSearch($search: String!) {
        fullTextSearch(search: $search) {
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

type SearchResult = GQLFullTextSearchQuery["fullTextSearch"]["nodes"][number];

const debounceMilliseconds = 300;

export const FullTextSearchBlock = withPreview(
    (_props: PropsWithData<FullTextSearchBlockData>) => {
        const intl = useIntl();
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
                    const { fullTextSearch } = await graphQLFetch<GQLFullTextSearchQuery, GQLFullTextSearchQueryVariables>(fullTextSearchQuery, {
                        search,
                    });

                    if (isCurrent) {
                        setResults(fullTextSearch.nodes);
                        setTotalCount(fullTextSearch.totalCount);
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
        }, [query]);

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
                                {results.map((result) => (
                                    <li key={`${result.entityName}-${result.id}`} className={styles.listItem}>
                                        <span className={styles.name}>{result.name}</span>
                                        {result.secondaryInformation && (
                                            <span className={styles.secondaryInformation}>{result.secondaryInformation}</span>
                                        )}
                                        <span className={styles.entityName}>{result.entityName}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </PageLayout>
        );
    },
    { label: "Full Text Search" },
);
