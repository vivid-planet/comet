import * as React from "react";

export interface ContentGenerationServiceContext {
    enabled: boolean;
}

export const ContentGenerationServiceContext = React.createContext<ContentGenerationServiceContext>({
    enabled: false,
});
