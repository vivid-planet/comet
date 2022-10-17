import { ParsedUrlQuery } from "querystring";

import { previewStateUrlParamName } from "./constants";
import { Url } from "./PreviewContext";

export const defaultPreviewPath = "/preview";

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

export function createPathToPreviewPath({
    path,
    previewPath,
    previewState,
    baseUrl,
}: {
    path: Url;
    previewPath: string;
    previewState: PreviewState;
    baseUrl: string;
}): Url {
    if (typeof path === "string") {
        const { pathname, searchParams } = new URL(`${previewPath}${path}`, baseUrl);

        searchParams.append(previewStateUrlParamName, JSON.stringify(previewState));

        return `${pathname}?${searchParams.toString()}`;
    } else {
        let query = path.query;

        if (typeof query === "string") {
            query += `&${previewStateUrlParamName}=${JSON.stringify(previewState)}`;
        } else if (typeof query === "object") {
            query = {
                ...query,
                [previewStateUrlParamName]: JSON.stringify(previewState),
            };
        }

        return {
            ...path,
            pathname: `${previewPath}${path.pathname}`,
            query,
        };
    }
}
