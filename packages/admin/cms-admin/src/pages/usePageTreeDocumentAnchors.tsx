import { makeVar, useReactiveVar } from "@apollo/client";

const localAnchorsVar = makeVar<Record<string, string[] | undefined>>({});

const remoteAnchorsVar = makeVar<Record<string, string[] | undefined>>({});

function unique(anchors: string[] | undefined): string[] | undefined {
    if (anchors === undefined) {
        return undefined;
    }

    const uniqueAnchors: string[] = [];

    for (const anchor of anchors) {
        if (!uniqueAnchors.includes(anchor)) {
            uniqueAnchors.push(anchor);
        }
    }

    return uniqueAnchors;
}

function updateLocalPageTreeNodeDocumentAnchors(pageTreeNodeId: string, anchors: string[] | undefined) {
    localAnchorsVar({ ...localAnchorsVar(), [pageTreeNodeId]: unique(anchors) });
}

function updateRemotePageTreeNodeDocumentAnchors(pageTreeNodeId: string, anchors: string[] | undefined) {
    remoteAnchorsVar({ ...remoteAnchorsVar(), [pageTreeNodeId]: unique(anchors) });
}

function usePageTreeNodeDocumentAnchors(pageTreeNodeId: string | undefined): string[] | undefined {
    const localAnchors = useReactiveVar(localAnchorsVar);
    const remoteAnchors = useReactiveVar(remoteAnchorsVar);

    if (pageTreeNodeId === undefined) {
        return undefined;
    }

    return localAnchors[pageTreeNodeId] ?? remoteAnchors[pageTreeNodeId];
}

export { updateLocalPageTreeNodeDocumentAnchors, updateRemotePageTreeNodeDocumentAnchors, usePageTreeNodeDocumentAnchors };
