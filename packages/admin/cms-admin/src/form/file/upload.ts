import { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";

interface UploadFileData {
    file: File;
    scope: Record<string, unknown>;
    folderId?: string;
    importSourceId?: string;
    importSourceType?: string;
}

export function upload<ResponseData>(
    apiClient: AxiosInstance,
    data: UploadFileData,
    cancelToken: CancelToken,
    options?: Omit<AxiosRequestConfig, "cancelToken">,
): Promise<AxiosResponse<ResponseData>> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("scope", JSON.stringify(data.scope));
    if (data.importSourceId && data.importSourceType) {
        formData.append("importSourceId", data.importSourceId);
        formData.append("importSourceType", data.importSourceType);
    }
    if (data.folderId !== undefined) {
        formData.append("folderId", data.folderId);
    }
    return apiClient.post<ResponseData>(`/dam/files/upload`, formData, {
        ...options,
        cancelToken,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
