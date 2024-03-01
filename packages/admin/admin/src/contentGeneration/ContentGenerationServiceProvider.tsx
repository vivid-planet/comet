import * as React from "react";

import { ContentGenerationServiceContext } from "./ContentGenerationServiceContext";

export const ContentGenerationServiceProvider: React.FunctionComponent<ContentGenerationServiceContext> = ({ children, config }) => {
    return <ContentGenerationServiceContext.Provider value={{ config }}>{children}</ContentGenerationServiceContext.Provider>;
};
