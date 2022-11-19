import { ParsedUrlQuery } from "querystring";

import { previewParamsUrlParamName } from "./constants";
import { Url } from "./PreviewContext";

export const defaultPreviewPath = "/preview";

interface SitePreviewParams {
    includeInvisibleBlocks: boolean;
}

const defaultParams: SitePreviewParams = {
    includeInvisibleBlocks: false,
};

export function parsePreviewParams(query: ParsedUrlQuery): SitePreviewParams {
    let previewParams: SitePreviewParams = defaultParams;
    const param = query[previewParamsUrlParamName];

    if (typeof param === "string") {
        try {
            previewParams = JSON.parse(param);
        } catch {
            // Ignore invalid preview state
        }
    }

    return previewParams;
}

export function createPathToPreviewPath({
    path,
    previewPath,
    previewParams,
    baseUrl,
}: {
    path: Url;
    previewPath: string;
    previewParams: SitePreviewParams;
    baseUrl: string;
}): Url {
    if (typeof path === "string") {
        const { pathname, searchParams } = new URL(`${previewPath}${path}`, baseUrl);

        searchParams.append(previewParamsUrlParamName, JSON.stringify(previewParams));

        return `${pathname}?${searchParams.toString()}`;
    } else {
        let query = path.query;

        if (typeof query === "string") {
            query += `&${previewParamsUrlParamName}=${JSON.stringify(previewParams)}`;
        } else if (typeof query === "object") {
            query = {
                ...query,
                [previewParamsUrlParamName]: JSON.stringify(previewParams),
            };
        }

        return {
            ...path,
            pathname: `${previewPath}${path.pathname}`,
            query,
        };
    }
}
