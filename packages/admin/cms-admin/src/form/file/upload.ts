import { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type CancelToken } from "axios";

import { type GQLUpdateDamFileInput } from "../../graphql.generated";

interface UploadFileData {
    file: File &
        Pick<GQLUpdateDamFileInput, "license" | "title" | "altText"> & { importSource?: { importSourceType: string; importSourceId: string } };
    scope: Record<string, unknown>;
    folderId?: string;
    /**
     * @deprecated Set `file.importSource.importSourceId` instead
     */
    importSourceId?: string;
    /**
     * @deprecated Set `file.importSource.importSourceType` instead
     */
    importSourceType?: string;
}

interface UploadFileParams {
    apiClient: AxiosInstance;
    data: UploadFileData;
    cancelToken: CancelToken;
    options?: Omit<AxiosRequestConfig, "cancelToken">;
    damBasePath: string;
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
    damBasePath,
}: UploadFileParams & { replace?: boolean }): Promise<AxiosResponse<ResponseData>> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("scope", JSON.stringify(data.scope));

    if (data.importSourceId && data.importSourceType && !data.file.importSource) {
        formData.append("importSourceId", data.importSourceId);
        formData.append("importSourceType", data.importSourceType);
    }
    if (data.file.importSource) {
        formData.append("importSourceId", data.file.importSource.importSourceId);
        formData.append("importSourceType", data.file.importSource.importSourceType);
    }
    if (data.file.license) {
        formData.append("license", JSON.stringify(data.file.license));
    }
    if (data.file.title) {
        formData.append("title", data.file.title);
    }
    if (data.file.altText) {
        formData.append("altText", data.file.altText);
    }
    if (data.folderId !== undefined) {
        formData.append("folderId", data.folderId);
    }

    const endpoint = replace ? `/${damBasePath}/files/replace-by-filename-and-folder` : `/${damBasePath}/files/upload`;

    return apiClient.post<ResponseData>(endpoint, formData, {
        ...options,
        cancelToken,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

interface ReplaceFileByIdData {
    file: File & Pick<GQLUpdateDamFileInput, "license" | "title" | "altText">;
    fileId: string;
}

export function replaceById<ResponseData>({
    apiClient,
    data,
    cancelToken,
    options,
    damBasePath,
}: Omit<UploadFileParams, "data"> & { data: ReplaceFileByIdData }): Promise<AxiosResponse<ResponseData>> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("fileId", data.fileId);
    if (data.file.license) {
        formData.append("license", JSON.stringify(data.file.license));
    }
    if (data.file.title) {
        formData.append("title", data.file.title);
    }
    if (data.file.altText) {
        formData.append("altText", data.file.altText);
    }

    return apiClient.post<ResponseData>(`/${damBasePath}/files/replace-by-id`, formData, {
        ...options,
        cancelToken,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
