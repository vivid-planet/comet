import * as React from "react";

import { ContentGenerationServiceContext } from "./ContentGenerationServiceContext";

export function useContentGenerationService(): ContentGenerationServiceContext {
    return React.useContext(ContentGenerationServiceContext);
}
