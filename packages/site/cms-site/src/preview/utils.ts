import { ParsedUrlQuery } from "querystring";

import { Url } from "./PreviewContext";

export const defaultPreviewPath = "/preview";

export interface SitePreviewParams {
    includeInvisibleBlocks: boolean;
}

const defaultParams: SitePreviewParams = {
    includeInvisibleBlocks: false,
};

export function parsePreviewParams(query: ParsedUrlQuery): SitePreviewParams {
    let previewParams: SitePreviewParams = defaultParams;
    const param = query.__preview;

    if (typeof param === "string") {
        try {
            previewParams = JSON.parse(param);
        } catch {
            // Ignore invalid preview state
        }
    }

    return previewParams;
}

/**
 * @deprecated Use parsePreviewParams instead
 */
const parsePreviewState = parsePreviewParams;

export { parsePreviewState };

export function createPathToPreviewPath({
    path,
    previewPath,
    previewParams,
}: {
    path: Url;
    previewPath: string;
    previewParams: SitePreviewParams;
}): Url {
    if (typeof path === "string") {
        const [pathname, search] = `${previewPath}${path}`.split("?");
        const searchParams = new URLSearchParams(search);

        searchParams.append("__preview", JSON.stringify(previewParams));

        return `${pathname}?${searchParams.toString()}`;
    } else {
        let query = path.query;

        if (typeof query === "string") {
            query += `&__preview=${JSON.stringify(previewParams)}`;
        } else if (typeof query === "object") {
            query = {
                ...query,
                __preview: JSON.stringify(previewParams),
            };
        }

        return {
            ...path,
            pathname: `${previewPath}${path.pathname}`,
            query,
        };
    }
}
