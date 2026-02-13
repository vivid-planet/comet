import Cookies from "js-cookie";

import { contentScopeLocalStorageKey } from "../../contentScope/ContentScopeSelect";

export const startImpersonation = async (userId: string) => {
    Cookies.set("comet-impersonate-user-id", userId);
    // Clear the stored scope so the impersonated user starts with their default scope
    localStorage.removeItem(contentScopeLocalStorageKey);
    location.href = "/";
};

export const stopImpersonation = async () => {
    Cookies.remove("comet-impersonate-user-id");
    location.href = "/";
};
