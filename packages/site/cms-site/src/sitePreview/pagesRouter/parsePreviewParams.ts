import { GetStaticPropsContext } from "next";

import { SitePreviewParams } from "../SitePreviewUtils";

function parsePreviewParams(context: GetStaticPropsContext): SitePreviewParams | null {
    if (!context.draftMode || !context.previewData) {
        return null;
    }

    return context.previewData as SitePreviewParams;
}

export { parsePreviewParams };
