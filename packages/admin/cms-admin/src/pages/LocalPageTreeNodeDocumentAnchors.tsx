import * as React from "react";

type PageTreeNodeId = string;

type LocalPageTreeNodeDocumentAnchors = Record<PageTreeNodeId, string[] | undefined>;

const LocalPageTreeNodeDocumentAnchorsContext = React.createContext<LocalPageTreeNodeDocumentAnchors>({});

function LocalPageTreeNodeDocumentAnchorsProvider({
    children,
    localAnchors,
}: {
    children: React.ReactNode;
    localAnchors: LocalPageTreeNodeDocumentAnchors;
}): JSX.Element {
    return <LocalPageTreeNodeDocumentAnchorsContext.Provider value={localAnchors}>{children}</LocalPageTreeNodeDocumentAnchorsContext.Provider>;
}

function useLocalPageTreeNodeAnchors(): LocalPageTreeNodeDocumentAnchors {
    return React.useContext(LocalPageTreeNodeDocumentAnchorsContext);
}

export { LocalPageTreeNodeDocumentAnchorsProvider, useLocalPageTreeNodeAnchors };
