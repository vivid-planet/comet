import * as React from "react";

export interface ContentGenerationServiceContext {
    config: {
        image?: boolean;
        imageAdvanced?: boolean;
        text?: boolean;
        textAdvanced?: boolean;
    };
}

export const ContentGenerationServiceContext = React.createContext<ContentGenerationServiceContext>({
    config: {
        image: false,
        imageAdvanced: false,
        text: false,
        textAdvanced: false,
    },
});
