import Cookies from "js-cookie";

export const startImpersonation = async (userId: string) => {
    Cookies.set("comet-impersonate-user-id", userId);
    location.href = "/";
};

export const stopImpersonation = async () => {
    Cookies.remove("comet-impersonate-user-id");
    location.href = "/";
};
