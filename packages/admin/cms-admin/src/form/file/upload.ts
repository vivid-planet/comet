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

interface UploadFileParams {
    apiClient: AxiosInstance;
    data: UploadFileData;
    cancelToken: CancelToken;
    options?: Omit<AxiosRequestConfig, "cancelToken">;
}

export function upload<ResponseData>(uploadFileParams: UploadFileParams): Promise<AxiosResponse<ResponseData>> {
    return uploadOrReplaceByFilenameAndFolder(uploadFileParams);
}

export function replaceByFilenameAndFolder<ResponseData>(uploadFileParams: UploadFileParams): Promise<AxiosResponse<ResponseData>> {
    return uploadOrReplaceByFilenameAndFolder({ ...uploadFileParams, replace: true });
}

function uploadOrReplaceByFilenameAndFolder<ResponseData>({
    apiClient,
    data,
    cancelToken,
    options,
    replace = false,
}: UploadFileParams & { replace?: boolean }): Promise<AxiosResponse<ResponseData>> {
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

    const endpoint = replace ? "/dam/files/replace-by-filename-and-folder" : "/dam/files/upload";

    return apiClient.post<ResponseData>(endpoint, formData, {
        ...options,
        cancelToken,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

interface ReplaceFileByIdData {
    file: File;
    fileId: string;
    importSourceId?: string;
    importSourceType?: string;
    license?: GQLLicenseInput;
}

export function replaceById<ResponseData>({
    apiClient,
    data,
    cancelToken,
    options,
}: Omit<UploadFileParams, "data"> & { data: ReplaceFileByIdData }): Promise<AxiosResponse<ResponseData>> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("fileId", data.fileId);
    if (data.importSourceId && data.importSourceType) {
        formData.append("importSourceId", data.importSourceId);
        formData.append("importSourceType", data.importSourceType);
    }
    if (data.license) {
        formData.append("license", JSON.stringify(data.license));
    }

    return apiClient.post<ResponseData>("/dam/files/replace-by-id", formData, {
        ...options,
        cancelToken,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
