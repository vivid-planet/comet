import { AuthorizationManager } from "@comet/react-app-auth";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export function createHttpClient(apiUrl: string, authorizationManager: AuthorizationManager): AxiosInstance {
    const headers: AxiosRequestConfig["headers"] = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    };
    const requestInterceptor = async (config: AxiosRequestConfig) => {
        if (!authorizationManager.state.oAuth?.accessToken) {
            return Promise.reject("Can't get user access token");
        }

        config.headers.Authorization = `Bearer ${authorizationManager.state.oAuth?.accessToken}`;
        config.headers["x-include-invisible-content"] = ["Pages:Unpublished", "Pages:Archived", "Blocks:Invisible"];

        return Promise.resolve(config);
    };

    const axiosClient = axios.create({
        baseURL: apiUrl,
        headers,
    });
    axiosClient.interceptors.request.use(requestInterceptor);

    return axiosClient;
}
