import { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";

import { DuplicateAction } from "../../dam/DataGrid/duplicatedFilenames/ManualDuplicatedFilenamesHandler";
import { GQLLicenseInput } from "../../graphql.generated";

interface UploadFileData {
    file: File;
    scope: Record<string, unknown>;
    folderId?: string;
    importSourceId?: string;
    importSourceType?: string;
    license?: GQLLicenseInput;
}

interface UploadFileParams {
    apiClient: AxiosInstance;
    data: UploadFileData;
    cancelToken: CancelToken;
    action: Omit<DuplicateAction, "skip">;
    options?: Omit<AxiosRequestConfig, "cancelToken">;
}

export function upload<ResponseData>({ apiClient, data, cancelToken, action, options }: UploadFileParams): Promise<AxiosResponse<ResponseData>> {
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

    const endpoint = action === "replace" ? "/dam/files/replace" : "/dam/files/upload";

    return apiClient.post<ResponseData>(endpoint, formData, {
        ...options,
        cancelToken,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
