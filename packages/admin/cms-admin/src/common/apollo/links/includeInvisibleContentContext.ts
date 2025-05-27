import { setContext } from "@apollo/client/link/context";

/**
 * adds http header "x-include-invisible-content" flag with Unpublished and Archive values, so we can fetch Unpublished and Archived Content from API
 */
export const includeInvisibleContentContext = setContext((request, prevContext) => {
    const headers: Record<string, unknown> = {
        "x-include-invisible-content": ["Pages:Unpublished", "Pages:Archived", "Blocks:Invisible"],
        "x-preview-dam-urls": "1",
    };
    const overrideHeaders = prevContext?.headers ? { ...prevContext.headers } : {};

    const xPreviewDamUrlsIsOverridden = Object.prototype.hasOwnProperty.call(overrideHeaders, "x-preview-dam-urls");
    const xPreviewDamUrlsEvaluatesToFalse = xPreviewDamUrlsIsOverridden && !overrideHeaders["x-preview-dam-urls"];
    delete overrideHeaders["x-preview-dam-urls"];

    if (xPreviewDamUrlsEvaluatesToFalse) {
        delete headers["x-preview-dam-urls"];
    }

    return {
        headers: {
            ...headers,
            ...overrideHeaders,
        },
    };
});
