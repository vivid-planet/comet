import { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";

import { GQLLicenseInput } from "../../graphql.generated";

interface UploadFileData {
    file: File;
    scope: Record<string, unknown>;
    folderId?: string;
    importSourceId?: string;
    importSourceType?: string;
    license?: GQLLicenseInput;
}

export function replace<ResponseData>(
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
    if (data.license) {
        formData.append("license", JSON.stringify(data.license));
    }
    if (data.folderId !== undefined) {
        formData.append("folderId", data.folderId);
    }
    return apiClient.post<ResponseData>(`/dam/files/replace`, formData, {
        ...options,
        cancelToken,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
