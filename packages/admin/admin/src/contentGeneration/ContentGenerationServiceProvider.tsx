import * as React from "react";

import { ContentGenerationServiceContext } from "./ContentGenerationServiceContext";

export const ContentGenerationServiceProvider: React.FunctionComponent<ContentGenerationServiceContext> = ({ children, enabled }) => {
    return <ContentGenerationServiceContext.Provider value={{ enabled }}>{children}</ContentGenerationServiceContext.Provider>;
};
