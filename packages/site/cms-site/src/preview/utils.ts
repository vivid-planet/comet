import { ParsedUrlQuery } from "querystring";

import { previewStateUrlParamName } from "./constants";

interface PreviewState {
    includeInvisibleBlocks: boolean;
}

const defaultState: PreviewState = {
    includeInvisibleBlocks: false,
};

export function parsePreviewState(query: ParsedUrlQuery): PreviewState {
    let previewState: PreviewState = defaultState;
    const param = query[previewStateUrlParamName];

    if (typeof param === "string") {
        try {
            previewState = JSON.parse(param);
        } catch {
            // Ignore invalid preview state
        }
    }

    return previewState;
}
