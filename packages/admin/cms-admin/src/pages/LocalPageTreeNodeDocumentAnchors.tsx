import { createContext, type PropsWithChildren, useContext } from "react";

type PageTreeNodeId = string;

type LocalPageTreeNodeDocumentAnchors = Record<PageTreeNodeId, string[] | undefined>;

const LocalPageTreeNodeDocumentAnchorsContext = createContext<LocalPageTreeNodeDocumentAnchors>({});

function LocalPageTreeNodeDocumentAnchorsProvider({
    children,
    localAnchors,
}: PropsWithChildren<{
    localAnchors: LocalPageTreeNodeDocumentAnchors;
}>) {
    return <LocalPageTreeNodeDocumentAnchorsContext.Provider value={localAnchors}>{children}</LocalPageTreeNodeDocumentAnchorsContext.Provider>;
}

function useLocalPageTreeNodeAnchors(): LocalPageTreeNodeDocumentAnchors {
    return useContext(LocalPageTreeNodeDocumentAnchorsContext);
}

export { LocalPageTreeNodeDocumentAnchorsProvider, useLocalPageTreeNodeAnchors };
