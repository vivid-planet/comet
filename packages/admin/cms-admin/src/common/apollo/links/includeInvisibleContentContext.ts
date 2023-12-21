import { setContext } from "@apollo/client/link/context";

/**
 * adds http header "x-include-invisible-content" flag with Unpublished and Archive values, so we can fetch Unpublished and Archived Content from API
 */
export const includeInvisibleContentContext = setContext((request, prevContext) => {
    return {
        headers: {
            ...prevContext.headers,
            "x-include-invisible-content": ["Pages:Unpublished", "Pages:Archived", "Blocks:Invisible"],
            "x-preview-dam-urls": "1",
        },
    };
});
