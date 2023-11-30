import * as React from "react";

import { SitePreviewProvider } from "./SitePreviewProvider";

export const SitePreviewPage: React.FunctionComponent = ({ children }) => {
    return <SitePreviewProvider previewPath="/preview">{children}</SitePreviewProvider>;
};

/**
 *  @deprecated Use SitePreviewPage instead
 */
const PreviewPage = SitePreviewPage;

export { PreviewPage };
