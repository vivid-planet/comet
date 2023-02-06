import { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";

interface UploadFileData {
    file: File;
    folderId?: string;
    scope?: Record<string, unknown>;
}

export function upload<ResponseData>(
    apiClient: AxiosInstance,
    data: UploadFileData,
    cancelToken: CancelToken,
    options?: Omit<AxiosRequestConfig, "cancelToken">,
): Promise<AxiosResponse<ResponseData>> {
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.folderId !== undefined) {
        formData.append("folderId", data.folderId);
    }
    if (data.scope !== undefined && Object.keys(data.scope).length > 0) {
        formData.append("scope", JSON.stringify(data.scope));
    }
    return apiClient.post<ResponseData>(`/dam/files/upload`, formData, {
        ...options,
        cancelToken,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
