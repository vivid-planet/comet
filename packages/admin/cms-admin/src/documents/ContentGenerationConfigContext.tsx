import { createContext, type PropsWithChildren, useContext } from "react";

export interface ContentGenerationConfig {
    seo?: {
        getRelevantContent: () => string[];
    };
}

const ContentGenerationConfigContext = createContext<ContentGenerationConfig | undefined>(undefined);

export const ContentGenerationConfigProvider = ({ children, ...rest }: PropsWithChildren<ContentGenerationConfig>) => {
    return <ContentGenerationConfigContext.Provider value={rest}>{children}</ContentGenerationConfigContext.Provider>;
};

export const useContentGenerationConfig = () => {
    return useContext(ContentGenerationConfigContext);
};
