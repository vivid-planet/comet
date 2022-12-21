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
            return { ...previousLocalAnchors, [pageTreeNodeId]: anchors === undefined ? undefined : Array.from(new Set(anchors)) };
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

export { LocalPageTreeNodeDocumentAnchorsProvider, useLocalPageTreeNodeAnchors };
