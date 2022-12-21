import { useApolloClient } from "@apollo/client";
import * as React from "react";

import { useCmsBlockContext } from "../blocks/useCmsBlockContext";
import { GQLPageQuery, GQLPageQueryVariables } from "../documents/types";
import { useLocalPageTreeNodeAnchors } from "./LocalPageTreeNodeDocumentAnchors";

function usePageTreeNodeDocumentAnchors(pageTreeNode: { id: string; documentType: string } | undefined): string[] | undefined {
    const client = useApolloClient();
    const { pageTreeDocumentTypes: documentTypes } = useCmsBlockContext();
    const localAnchors = useLocalPageTreeNodeAnchors();
    const [remoteAnchors, setRemoteAnchors] = React.useState<Record<string, string[] | undefined>>({});

    React.useEffect(() => {
        async function fetchRemoteAnchors() {
            if (pageTreeNode == null) {
                return;
            }

            const documentType = documentTypes[pageTreeNode.documentType];

            if (documentType === undefined) {
                throw new Error(`Unknown document type "${pageTreeNode.documentType}"`);
            }

            if (documentType.getQuery === undefined || documentType.anchors === undefined) {
                console.warn(`Document type "${pageTreeNode.documentType}" doesn't support anchors`);
                setRemoteAnchors((previousRemoteAnchors) => {
                    return { ...previousRemoteAnchors, [pageTreeNode.id]: [] };
                });
                return;
            }

            const { data } = await client.query<GQLPageQuery, GQLPageQueryVariables>({
                query: documentType.getQuery,
                variables: { id: pageTreeNode.id },
            });

            if (data.page?.document == null) {
                setRemoteAnchors((previousRemoteAnchors) => {
                    return { ...previousRemoteAnchors, [pageTreeNode.id]: [] };
                });
                return;
            }

            const documentAnchors = documentType.anchors(data.page.document);

            setRemoteAnchors((previousRemoteAnchors) => {
                return { ...previousRemoteAnchors, [pageTreeNode.id]: Array.from(new Set(documentAnchors)) };
            });
        }

        fetchRemoteAnchors();
    }, [pageTreeNode, client, documentTypes]);

    if (pageTreeNode === undefined) {
        return undefined;
    }

    return localAnchors[pageTreeNode.id] ?? remoteAnchors[pageTreeNode.id];
}

export { usePageTreeNodeDocumentAnchors };
