import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

import { PageTreeNodeVisibility } from "../../page-tree/types";
import { getRequestFromExecutionContext } from "./utils";

export interface RequestContextInterface {
    includeInvisiblePages?: Array<PageTreeNodeVisibility.Archived | PageTreeNodeVisibility.Unpublished>;
    includeInvisibleBlocks?: boolean;
    previewDamUrls: boolean;
}

export const getRequestContextHeadersFromRequest = (request: Request): RequestContextInterface => {
    const includeInvisibleContent = parseIncludeInvisibleHeader(request.headers["x-include-invisible-content"]);
    return {
        includeInvisiblePages: includeInvisibleContent,
        includeInvisibleBlocks: includeInvisibleContent && includeInvisibleContent.length > 0,
        previewDamUrls: !!request.headers["x-preview-dam-urls"],
    };
};

export const RequestContext = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): RequestContextInterface => {
        const request = getRequestFromExecutionContext(ctx);

        return getRequestContextHeadersFromRequest(request);
    },
);

function parseIncludeInvisibleHeader(
    rawHeader: undefined | string | string[],
): undefined | Array<PageTreeNodeVisibility.Archived | PageTreeNodeVisibility.Unpublished> {
    if (!rawHeader) {
        return undefined;
    }

    const header = !Array.isArray(rawHeader) ? rawHeader.split(",").map((c) => c.trim()) : rawHeader;

    const whitelist: Array<PageTreeNodeVisibility.Archived | PageTreeNodeVisibility.Unpublished> = [
        PageTreeNodeVisibility.Archived,
        PageTreeNodeVisibility.Unpublished,
    ];

    const validValues: Array<PageTreeNodeVisibility.Archived | PageTreeNodeVisibility.Unpublished> = [];
    whitelist.forEach((c) => {
        if (header.includes(c)) {
            validValues.push(c);
        }
    });

    if (validValues.length < 1) {
        return undefined;
    }

    return validValues;
}
