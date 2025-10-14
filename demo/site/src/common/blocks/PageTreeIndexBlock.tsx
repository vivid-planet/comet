import { gql } from "@comet/site-nextjs";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { useEffect, useState } from "react";

import { pageTreeIndexFragment } from "./PageTreeIndex.fragement";
import { type GQLPageTreeIndexFragment } from "./PageTreeIndex.fragement.generated";
import { type GQLMainMenuQuery } from "./PageTreeIndexBlock.generated";

const pageTreeQuery = gql`
    query MainMenu($domain: String!, $language: String!) {
        mainMenu(scope: { domain: $domain, language: $language }) {
            ...PageTreeIndex
        }
    }
    ${pageTreeIndexFragment}
`;

export function PageTreeIndexBlock(): JSX.Element {
    const [pageTree, setPageTree] = useState<GQLPageTreeIndexFragment | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const graphQLFetch = createGraphQLFetch();

        async function fetchPageTree() {
            try {
                const data: GQLMainMenuQuery = await graphQLFetch(pageTreeQuery, {
                    domain: "main",
                    language: "en",
                });
                setPageTree(data.mainMenu);
            } catch (err) {
                setError(String(err));
            }
        }
        fetchPageTree();
    }, []);

    if (error) return <pre>Error: {error}</pre>;
    if (!pageTree) return <p>Loading...</p>;

    console.log(pageTree);

    return (
        <div>
            <ul>
                {pageTree.items.map((item) => {
                    const hasChildren = item.node.childNodes && item.node.childNodes.length > 0;
                    return (
                        <li key={item.id}>
                            {item.node.name}
                            {hasChildren && (
                                <ul>
                                    {item.node.childNodes.map((child) => (
                                        <li key={child.id}>{child.name}</li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
