import * as React from "react";

interface LocalPageTreeNodeDocumentAnchorsApi {
    localAnchors: Record<string, string[] | undefined>;
    updateLocalAnchors: (pageTreeNodeId: string, anchors: string[] | undefined) => void;
}

const LocalPageTreeNodeDocumentAnchorsContext = React.createContext<LocalPageTreeNodeDocumentAnchorsApi>({
    localAnchors: {},
    updateLocalAnchors: () => {
        // noop
    },
});

function LocalPageTreeNodeDocumentAnchorsProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [localAnchors, setLocalAnchors] = React.useState<Record<string, string[] | undefined>>({});

    const updateLocalAnchors = React.useCallback((pageTreeNodeId: string, anchors: string[] | undefined) => {
        setLocalAnchors((previousLocalAnchors) => {
            return { ...previousLocalAnchors, [pageTreeNodeId]: uniqueAnchors(anchors) };
        });
    }, []);

    return (
        <LocalPageTreeNodeDocumentAnchorsContext.Provider value={{ localAnchors, updateLocalAnchors }}>
            {children}
        </LocalPageTreeNodeDocumentAnchorsContext.Provider>
    );
}

function useLocalPageTreeNodeAnchors(): LocalPageTreeNodeDocumentAnchorsApi {
    return React.useContext(LocalPageTreeNodeDocumentAnchorsContext);
}

function uniqueAnchors(anchors: string[] | undefined): string[] | undefined {
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

export { LocalPageTreeNodeDocumentAnchorsProvider, uniqueAnchors, useLocalPageTreeNodeAnchors };
