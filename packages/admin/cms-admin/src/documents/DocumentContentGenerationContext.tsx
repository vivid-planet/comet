import { createContext, PropsWithChildren, useContext } from "react";

export interface DocumentContentGenerationApi {
    seoBlock?: {
        getDocumentContent: () => string[];
    };
}

const DocumentContentGenerationContext = createContext<DocumentContentGenerationApi | undefined>(undefined);

export const DocumentContentGenerationProvider = ({ children, ...rest }: PropsWithChildren<DocumentContentGenerationApi>) => {
    return <DocumentContentGenerationContext.Provider value={rest}>{children}</DocumentContentGenerationContext.Provider>;
};

export const useDocumentContentGenerationApi = () => {
    return useContext(DocumentContentGenerationContext);
};
