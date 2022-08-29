import { useApolloClient } from "@apollo/client";
import axios, { AxiosError, CancelTokenSource } from "axios";
import * as mimedb from "mime-db";
import * as React from "react";
import { Accept, FileRejection } from "react-dropzone";

import { useCmsBlockContext } from "../../..";
import { NetworkError, UnknownError } from "../../../common/errors/errorMessages";
import { upload } from "../../../form/file/upload";
import {
    GQLDamFolderByNameAndParentIdQuery,
    GQLDamFolderByNameAndParentIdQueryVariables,
    GQLDamFolderForFolderUploadMutation,
    GQLDamFolderForFolderUploadMutationVariables,
} from "../../../graphql.generated";
import { useDamAcceptedMimeTypes } from "../../config/useDamAcceptedMimeTypes";
import { createDamFolderForFolderUpload, damFolderByNameAndParentId } from "./fileUpload.gql";
import { useFileUploadContext } from "./FileUploadContext";
import { FileUploadErrorDialog } from "./FileUploadErrorDialog";
import {
    FileExtensionTypeMismatchError,
    FileSizeError,
    MaxResolutionError,
    MissingFileExtensionError,
    UnsupportedTypeError,
} from "./fileUploadErrorMessages";
import { ProgressDialog } from "./ProgressDialog";

interface FileWithFolderPath extends File {
    path?: string;
    folderPath?: string;
}

interface UploadFileOptions {
    acceptedMimetypes?: string[];
    onAfterUpload?: () => void;
}

interface Files {
    acceptedFiles: FileWithFolderPath[];
    fileRejections: FileRejection[];
}

interface FileUploadApi {
    uploadFiles: ({ acceptedFiles, fileRejections }: Files, folderId?: string) => void;
    validationErrors?: FileUploadValidationError[];
    maxFileSizeInBytes: number;
    dialogs: React.ReactNode;
    dropzoneConfig: {
        accept: Accept;
        multiple: boolean;
        maxSize: number;
    };
    newlyUploadedFileIds: string[];
}

export interface FileUploadValidationError {
    file: Pick<FileWithFolderPath, "name" | "path">;
    message: React.ReactNode;
}

const addFolderPath = async (acceptedFiles: FileWithFolderPath[]) => {
    const newFiles = [];

    for (const file of acceptedFiles) {
        let harmonizedPath: string | undefined;
        // when files are uploaded via input field, the path does not have a "/" prefix
        // when files are uploaded via drag and drop, the path does have a "/" prefix
        // if the path has a "/" prefix, this prefix is removed => path is harmonized
        if (file.path?.startsWith("/")) {
            harmonizedPath = file.path?.split("/").splice(1).join("/");
        } else {
            harmonizedPath = file.path;
        }

        // Create a new file because of a strange bug in Firefox that when uploading a folder via drag and drop
        // changes the mimetype of all uploaded files to "application/octet-stream". This behavior only happens in Firefox
        // (not in Chrome or Safari) and I couldn't find the reason for it.
        // When looking at the formData in the web dev tools, the mimetype is still correct. It is only changed to a
        // wrong type in the actual request.
        // The bug could be avoided by creating a new file. Maybe an issue with Dropzone?
        const buffer = await file.arrayBuffer();
        const newFile: FileWithFolderPath = new File([buffer], file.name, { lastModified: file.lastModified, type: file.type });
        newFile.path = file.path;

        const folderPath = harmonizedPath?.split("/").slice(0, -1).join("/");
        newFile.folderPath = folderPath && folderPath?.length > 0 ? folderPath : undefined;

        newFiles.push(newFile);
    }

    return newFiles;
};

export const useFileUpload = (options: UploadFileOptions): FileUploadApi => {
    const context = useCmsBlockContext(); // TODO create separate CmsContext?
    const client = useApolloClient();

    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();
    const accept: Accept = React.useMemo(() => {
        const acceptObj: Accept = {};
        const acceptedMimetypes = options.acceptedMimetypes ?? allAcceptedMimeTypes;

        acceptedMimetypes.forEach((mimetype) => {
            const extensions = mimedb[mimetype]?.extensions;
            if (extensions) {
                acceptObj[mimetype] = extensions.map((extension) => `.${extension}`);
            }
        });

        return acceptObj;
    }, [allAcceptedMimeTypes, options.acceptedMimetypes]);

    const { newlyUploadedFileIds, addNewlyUploadedFileIds } = useFileUploadContext();

    const [progressDialogOpen, setProgressDialogOpen] = React.useState<boolean>(false);
    const [validationErrors, setValidationErrors] = React.useState<FileUploadValidationError[] | undefined>();
    const [errorDialogOpen, setErrorDialogOpen] = React.useState<boolean>(false);
    const [totalSizes, setTotalSizes] = React.useState<{ [key: string]: number }>({});
    const [loadedSizes, setLoadedSizes] = React.useState<{ [key: string]: number }>({});

    const totalSize = Object.values(totalSizes).length > 0 ? Object.values(totalSizes).reduce((prev, curr) => prev + curr, 0) : undefined;
    const loadedSize = Object.values(loadedSizes).length > 0 ? Object.values(loadedSizes).reduce((prev, curr) => prev + curr, 0) : undefined;

    const maxFileSizeInMegabytes = parseInt(context.damConfig.maxFileSize);
    const maxFileSizeInBytes = maxFileSizeInMegabytes * 1024 * 1024;
    const cancelUpload = React.useRef<CancelTokenSource>();

    const addValidationError = (file: FileWithFolderPath, newError: React.ReactNode) => {
        setValidationErrors((prevErrors) => {
            const existingErrors = prevErrors ?? [];
            return [...existingErrors, { file, message: newError }];
        });
    };

    const addTotalSize = (path: string, value: number) => {
        setTotalSizes((prev) => ({ ...prev, [path]: value }));
    };

    const updateLoadedSize = (path: string, value: number) => {
        setLoadedSizes((prev) => ({ ...prev, [path]: value }));
    };

    const generateValidationErrorsForRejectedFiles = React.useCallback(
        (fileRejections: FileRejection[]) => {
            for (const fileRejection of fileRejections) {
                if (fileRejection.file.size > maxFileSizeInBytes) {
                    addValidationError(fileRejection.file, <FileSizeError maxFileSizeInBytes={maxFileSizeInBytes} />);
                }

                if (!accept[fileRejection.file.type]) {
                    const extension = `.${fileRejection.file.name.split(".").pop()}`;
                    addValidationError(fileRejection.file, <UnsupportedTypeError extension={extension} />);
                }
            }
        },
        [accept, maxFileSizeInBytes],
    );

    const lookupDamFolder = React.useCallback(
        async (folderName: string, parentId?: string) => {
            const { data } = await client.query<GQLDamFolderByNameAndParentIdQuery, GQLDamFolderByNameAndParentIdQueryVariables>({
                query: damFolderByNameAndParentId,
                variables: {
                    name: folderName,
                    parentId: parentId,
                },
                fetchPolicy: "no-cache",
            });

            return data.damFolder?.id;
        },
        [client],
    );

    const createDamFolder = React.useCallback(
        async (folderName: string, parentId?: string) => {
            const { data } = await client.mutate<GQLDamFolderForFolderUploadMutation, GQLDamFolderForFolderUploadMutationVariables>({
                mutation: createDamFolderForFolderUpload,
                variables: {
                    name: folderName,
                    parentId: parentId,
                },
            });

            if (!data) {
                throw new Error("Could not create Folder");
            }

            return data.createDamFolder.id;
        },
        [client],
    );

    const createFoldersIfNecessary = React.useCallback(
        async (externalFolderIdMap: Map<string, string>, file: FileWithFolderPath, currFolderId?: string) => {
            const folderIdMap = new Map(externalFolderIdMap);

            let noLookup = false;
            if (file.folderPath === undefined) {
                return folderIdMap;
            }

            const pathArr = file.folderPath.split("/");

            for (let i = 1; i <= pathArr.length; i++) {
                const path = pathArr.slice(0, i);

                const completePath = path.join("/");
                const folderName = path[path.length - 1];
                const parentPath = path.slice(0, -1).join("/");

                if (folderIdMap.has(completePath)) {
                    continue;
                }

                const parentId = folderIdMap.has(parentPath) ? folderIdMap.get(parentPath) : currFolderId;

                if (!noLookup) {
                    // parentId cannot be null because then noLookup would be true
                    const id = await lookupDamFolder(folderName, parentId);

                    if (id === undefined) {
                        // paths are looked up hierarchically starting with the first folder e.g.
                        //   1. lookup: media_folder
                        //   2. lookup: media_folder/inner_folder
                        // if media_folder doesn't exist, there is no point in looking up inner_folder
                        // because it cannot exist without its parent => noLookup
                        noLookup = true;
                    } else {
                        folderIdMap.set(completePath, id);
                        continue;
                    }
                }

                const id = await createDamFolder(folderName, parentId);
                folderIdMap.set(completePath, id);
            }

            return folderIdMap;
        },
        [createDamFolder, lookupDamFolder],
    );

    const uploadFiles = async ({ acceptedFiles, fileRejections }: Files, folderId?: string) => {
        setProgressDialogOpen(true);
        setValidationErrors(undefined);

        const uploadedFileIds: string[] = [];

        let errorOccurred = false;
        if (fileRejections.length > 0) {
            errorOccurred = true;
            generateValidationErrorsForRejectedFiles(fileRejections);
        }

        if (acceptedFiles.length > 0) {
            const filesWithFolderPaths = await addFolderPath(acceptedFiles);
            let folderIdMap = new Map<string, string>();

            for (const file of filesWithFolderPaths) {
                addTotalSize(file.path ?? "", file.size);
            }

            cancelUpload.current = axios.CancelToken.source();
            for (const file of filesWithFolderPaths) {
                folderIdMap = await createFoldersIfNecessary(folderIdMap, file, folderId);
                const targetFolderId = file.folderPath && folderIdMap.has(file.folderPath) ? folderIdMap.get(file.folderPath) : folderId;

                try {
                    const response: { data: { id: string } } = await upload(
                        context.damConfig.apiClient,
                        {
                            file,
                            folderId: targetFolderId,
                        },
                        cancelUpload.current.token,
                        {
                            onUploadProgress: (progressEvent: ProgressEvent) => {
                                updateLoadedSize(file.path ?? "", progressEvent.loaded);
                            },
                        },
                    );

                    uploadedFileIds.push(response.data.id);
                } catch (err) {
                    errorOccurred = true;
                    const typedErr = err as AxiosError<{ error: string; message: string; statusCode: number }>;

                    if (typedErr.response?.data.error === "CometImageResolutionException") {
                        addValidationError(file, <MaxResolutionError maxResolution={Number(context.damConfig.maxSrcResolution)} />);
                    } else if (typedErr.response?.data.error === "CometValidationException") {
                        const message = typedErr.response.data.message;
                        const extension = `.${file.name.split(".").pop()}`;

                        if (message.includes("Unsupported mime type")) {
                            addValidationError(file, <UnsupportedTypeError extension={extension} />);
                        } else if (message.includes("Missing file extension")) {
                            addValidationError(file, <MissingFileExtensionError />);
                        } else if (message.includes("File type and extension mismatch")) {
                            addValidationError(file, <FileExtensionTypeMismatchError extension={extension} mimetype={file.type} />);
                        } else {
                            addValidationError(file, <UnknownError />);
                        }
                    } else if (typedErr.response === undefined && typedErr.request) {
                        addValidationError(file, <NetworkError />);
                    } else {
                        addValidationError(file, <UnknownError />);
                    }
                }
            }
        }

        setProgressDialogOpen(false);
        if (errorOccurred) {
            setErrorDialogOpen(true);
        }
        setTotalSizes({});
        setLoadedSizes({});
        options.onAfterUpload?.();

        addNewlyUploadedFileIds(uploadedFileIds);
    };

    return {
        uploadFiles,
        validationErrors,
        maxFileSizeInBytes,
        dialogs: (
            <>
                <FileUploadErrorDialog
                    open={errorDialogOpen}
                    validationErrors={validationErrors}
                    onClose={() => {
                        setValidationErrors(undefined);
                        setErrorDialogOpen(false);
                    }}
                />
                <ProgressDialog open={progressDialogOpen} totalSize={totalSize} loadedSize={loadedSize} />
            </>
        ),
        dropzoneConfig: {
            accept: accept,
            multiple: true,
            maxSize: maxFileSizeInBytes,
        },
        newlyUploadedFileIds,
    };
};
