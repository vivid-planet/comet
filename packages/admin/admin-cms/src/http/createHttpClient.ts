import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { UserManager } from "oidc-client";

export function createHttpClient(apiUrl: string, userService: UserManager): AxiosInstance {
    const headers: AxiosRequestConfig["headers"] = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    };
    const requestInterceptor = async (config: AxiosRequestConfig) => {
        const user = await userService.getUser();
        if (!user?.access_token) {
            return Promise.reject("Can't get user access token");
        }

        config.headers.Authorization = `Bearer ${user.access_token}`;
        config.headers["x-include-invisible-content"] = ["Unpublished", "Archived"];

        return Promise.resolve(config);
    };

    const axiosClient = axios.create({
        baseURL: apiUrl,
        headers,
    });
    axiosClient.interceptors.request.use(requestInterceptor);

    return axiosClient;
}
