import * as React from "react";

import { SitePreviewIFrameBridgeContext } from "./SitePreviewIFrameBridge";

export function useSitePreviewIFrameBridge(): SitePreviewIFrameBridgeContext {
    return React.useContext(SitePreviewIFrameBridgeContext);
}
