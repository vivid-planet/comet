import { useApolloClient } from "@apollo/client";
import axios, { AxiosError, CancelTokenSource } from "axios";
import * as mimedb from "mime-db";
import * as React from "react";
import { Accept, FileRejection } from "react-dropzone";

import { useCmsBlockContext } from "../../..";
import { NetworkError, UnknownError } from "../../../common/errors/errorMessages";
import { upload } from "../../../form/file/upload";
import { useDamAcceptedMimeTypes } from "../../config/useDamAcceptedMimeTypes";
import { useDamScope } from "../../config/useDamScope";
import { clearDamItemCache } from "../../helpers/clearDamItemCache";
import { FilenameData, useManualDuplicatedFilenamesHandler } from "../duplicatedFilenames/ManualDuplicatedFilenamesHandler";
import { NewlyUploadedItem, useFileUploadContext } from "./FileUploadContext";
import { FileUploadErrorDialog } from "./FileUploadErrorDialog";
import {
    FileExtensionTypeMismatchError,
    FileSizeError,
    MaxResolutionError,
    MissingFileExtensionError,
    SvgContainsJavaScriptError,
    UnsupportedTypeError,
} from "./fileUploadErrorMessages";
import { ProgressDialog } from "./ProgressDialog";
import { createDamFolderForFolderUpload, damFolderByNameAndParentId } from "./useFileUpload.gql";
import {
    GQLDamFolderByNameAndParentIdQuery,
    GQLDamFolderByNameAndParentIdQueryVariables,
    GQLDamFolderForFolderUploadMutation,
    GQLDamFolderForFolderUploadMutationVariables,
} from "./useFileUpload.gql.generated";

interface FileWithPath extends File {
    path?: string;
}

interface FileWithFolderPath extends FileWithPath {
    folderPath?: string;
}

interface UploadFileOptions {
    acceptedMimetypes?: string[];
}

interface Files {
    acceptedFiles: FileWithPath[];
    fileRejections: FileRejection[];
}

interface ImportedSource {
    sourceId: string;
    sourceType: string;
}

interface UploadFileOptions {
    folderId?: string;
    importedFile?: ImportedSource;
}

export interface FileUploadApi {
    uploadFiles: ({ acceptedFiles, fileRejections }: Files, { folderId, importedFile }: UploadFileOptions) => Promise<void>;
    validationErrors?: FileUploadValidationError[];
    maxFileSizeInBytes: number;
    dialogs: React.ReactNode;
    dropzoneConfig: {
        accept: Accept;
        multiple: boolean;
        maxSize: number;
    };
    newlyUploadedItems: NewlyUploadedItem[];
}

export interface FileUploadValidationError {
    file: Pick<FileWithFolderPath, "name" | "path">;
    message: React.ReactNode;
}

const addFolderPathToFiles = async (acceptedFiles: FileWithPath[]): Promise<FileWithFolderPath[]> => {
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
    const onAfterUpload = () => {
        client.reFetchObservableQueries();
        clearDamItemCache(client.cache);
    };
    const context = useCmsBlockContext(); // TODO create separate CmsContext?
    const client = useApolloClient();
    const manualDuplicatedFilenamesHandler = useManualDuplicatedFilenamesHandler();
    const scope = useDamScope();

    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();
    const accept: Accept = React.useMemo(() => {
        const acceptObj: Accept = {};
        const acceptedMimetypes = options.acceptedMimetypes ?? allAcceptedMimeTypes;

        acceptedMimetypes.forEach((mimetype) => {
            let extensions: readonly string[] | undefined;
            if (mimetype === "application/x-zip-compressed") {
                // zip files in Windows, not supported by mime-db
                // see https://github.com/jshttp/mime-db/issues/245
                extensions = ["zip"];
            } else {
                extensions = mimedb[mimetype]?.extensions;
            }

            if (extensions) {
                acceptObj[mimetype] = extensions.map((extension) => `.${extension}`);
            }
        });

        return acceptObj;
    }, [allAcceptedMimeTypes, options.acceptedMimetypes]);

    const { newlyUploadedItems, addNewlyUploadedItems } = useFileUploadContext();

    const [progressDialogOpen, setProgressDialogOpen] = React.useState<boolean>(false);
    const [validationErrors, setValidationErrors] = React.useState<FileUploadValidationError[] | undefined>();
    const [errorDialogOpen, setErrorDialogOpen] = React.useState<boolean>(false);
    const [totalSizes, setTotalSizes] = React.useState<{ [key: string]: number }>({});
    const [uploadedSizes, setUploadedSizes] = React.useState<{ [key: string]: number }>({});

    const totalSize = Object.values(totalSizes).length > 0 ? Object.values(totalSizes).reduce((prev, curr) => prev + curr, 0) : undefined;
    const uploadedSize = Object.values(uploadedSizes).length > 0 ? Object.values(uploadedSizes).reduce((prev, curr) => prev + curr, 0) : undefined;

    const maxFileSizeInMegabytes = context.damConfig.maxFileSize;
    const maxFileSizeInBytes = maxFileSizeInMegabytes * 1024 * 1024;
    const cancelUpload = React.useRef<CancelTokenSource>();

    const addValidationError = (file: FileWithFolderPath, newError: React.ReactNode) => {
        setValidationErrors((prevErrors) => {
            const existingErrors = prevErrors ?? [];
            return [...existingErrors, { file, message: newError }];
        });
    };

    const updateLoadedSize = (path: string, value: number) => {
        setUploadedSizes((prev) => ({ ...prev, [path]: value }));
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
                    scope,
                },
                fetchPolicy: "network-only",
            });

            return data.damFolder?.id;
        },
        [client, scope],
    );

    const createDamFolder = React.useCallback(
        async (folderName: string, parentId?: string) => {
            const { data } = await client.mutate<GQLDamFolderForFolderUploadMutation, GQLDamFolderForFolderUploadMutationVariables>({
                mutation: createDamFolderForFolderUpload,
                variables: {
                    name: folderName,
                    parentId: parentId,
                    scope,
                },
            });

            if (!data) {
                throw new Error("Could not create Folder");
            }

            return data.createDamFolder.id;
        },
        [client, scope],
    );

    const createInitialFolderIdMap = React.useCallback(
        async (files: FileWithFolderPath[], currFolderId?: string) => {
            const folderIdMap = new Map<string, string>();
            const lookupCache = new Map<string, string | undefined>();

            for (const file of files) {
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
                        let id: string | undefined;
                        if (lookupCache.has(`${folderName}:${parentId}`)) {
                            id = lookupCache.get(`${folderName}:${parentId}`);
                        } else {
                            id = await lookupDamFolder(folderName, parentId);
                            lookupCache.set(`${folderName}:${parentId}`, id);
                        }

                        if (id === undefined) {
                            // paths are looked up hierarchically starting with the first folder e.g.
                            //   1. lookup: media_folder
                            //   2. lookup: media_folder/inner_folder
                            // if media_folder doesn't exist, there is no point in looking up inner_folder
                            // because it cannot exist without its parent => noLookup
                            noLookup = true;
                        } else {
                            folderIdMap.set(completePath, id);
                        }
                    }
                }
            }

            return folderIdMap;
        },
        [lookupDamFolder],
    );

    const createFoldersIfNecessary = React.useCallback(
        async (externalFolderIdMap: Map<string, string>, file: FileWithFolderPath, currFolderId?: string) => {
            const newlyCreatedFolderIds: Array<{ id: string; parentId?: string }> = [];
            const folderIdMap = new Map(externalFolderIdMap);

            if (file.folderPath === undefined) {
                return { folderIdMap, newlyCreatedFolderIds };
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

                const id = await createDamFolder(folderName, parentId);
                newlyCreatedFolderIds.push({ id, parentId });
                folderIdMap.set(completePath, id);
            }

            return { folderIdMap, newlyCreatedFolderIds };
        },
        [createDamFolder],
    );

    const mapFilenameDataToFiles = (
        filenameDataList: FilenameData[],
        files: FileWithFolderPath[],
        currentFolderId: string | undefined,
        folderIdMap: Map<string, string>,
    ) => {
        const filesToUpload = filenameDataList.map((data) => {
            return files.find((file) => {
                const fileFolderId = file.folderPath && folderIdMap.has(file.folderPath) ? folderIdMap.get(file.folderPath) : currentFolderId;

                return file.name === data.name && fileFolderId === data.folderId;
            }) as FileWithFolderPath;
        });

        return filesToUpload;
    };

    const handleDuplicatedFilenames = React.useCallback(
        async (
            filesWithFolderPaths: FileWithFolderPath[],
            currentFolderId: string | undefined,
            folderIdMap: Map<string, string>,
        ): Promise<FileWithFolderPath[]> => {
            if (manualDuplicatedFilenamesHandler === undefined) {
                return filesWithFolderPaths;
            }

            const filesInNewDir: FileWithFolderPath[] = [];
            const filesInExistingDir: FileWithFolderPath[] = [];

            for (const file of filesWithFolderPaths) {
                if (file.folderPath === undefined || folderIdMap.has(file.folderPath)) {
                    filesInExistingDir.push(file);
                } else {
                    // filter out files in newly uploaded folders, because the duplicated filename
                    // check isn't possible for new folders since they don't have an id.
                    // It's also not necessary because in a local filesystem there
                    // typically can't be duplicate filenames. If there's still a conflict,
                    // it's resolved automatically in the API by adding a sequential number.
                    filesInNewDir.push(file);
                }
            }

            const revisedFilenameDataList = await manualDuplicatedFilenamesHandler?.letUserHandleDuplicates(
                filesInExistingDir.map((file) => ({
                    name: file.name,
                    folderId: file.folderPath && folderIdMap.has(file.folderPath) ? folderIdMap.get(file.folderPath) : currentFolderId,
                })),
            );

            const filesToUpload = mapFilenameDataToFiles(revisedFilenameDataList, filesWithFolderPaths, currentFolderId, folderIdMap);

            filesToUpload.push(...filesInNewDir);
            return filesToUpload;
        },
        [manualDuplicatedFilenamesHandler],
    );

    const uploadFiles = async ({ acceptedFiles, fileRejections }: Files, { folderId, importedFile }: UploadFileOptions): Promise<void> => {
        setProgressDialogOpen(true);
        setValidationErrors(undefined);

        const uploadedFolders: Array<NewlyUploadedItem & { type: "folder" }> = [];
        const uploadedFiles: Array<NewlyUploadedItem & { type: "file" }> = [];

        let errorOccurred = false;
        if (fileRejections.length > 0) {
            errorOccurred = true;
            generateValidationErrorsForRejectedFiles(fileRejections);
        }

        if (acceptedFiles.length > 0) {
            const filesWithFolderPaths = await addFolderPathToFiles(acceptedFiles);
            let folderIdMap = await createInitialFolderIdMap(filesWithFolderPaths, folderId);

            const fileSizes: { [key: string]: number } = {};
            for (const file of filesWithFolderPaths) {
                fileSizes[file.path ?? ""] = file.size;
            }
            setTotalSizes(fileSizes);

            const filesToUpload = await handleDuplicatedFilenames(filesWithFolderPaths, folderId, folderIdMap);

            cancelUpload.current = axios.CancelToken.source();
            for (const file of filesToUpload) {
                const { folderIdMap: newFolderIdMap, newlyCreatedFolderIds } = await createFoldersIfNecessary(folderIdMap, file, folderId);
                folderIdMap = newFolderIdMap;
                uploadedFolders.push(
                    ...newlyCreatedFolderIds.map((folder): NewlyUploadedItem & { type: "folder" } => ({
                        id: folder.id,
                        parentId: folder.parentId,
                        type: "folder",
                    })),
                );

                const targetFolderId = file.folderPath && folderIdMap.has(file.folderPath) ? folderIdMap.get(file.folderPath) : folderId;

                try {
                    const response: { data: { id: string } } = await upload(
                        context.damConfig.apiClient,
                        {
                            file,
                            folderId: targetFolderId,
                            scope,
                            importSourceId: importedFile?.sourceId,
                            importSourceType: importedFile?.sourceType,
                        },
                        cancelUpload.current.token,
                        {
                            onUploadProgress: (progressEvent: ProgressEvent) => {
                                updateLoadedSize(file.path ?? "", progressEvent.loaded);
                            },
                        },
                    );

                    uploadedFiles.push({ id: response.data.id, parentId: targetFolderId, type: "file" });
                } catch (err) {
                    errorOccurred = true;
                    const typedErr = err as AxiosError<{ error: string; message: string; statusCode: number }>;

                    if (typedErr.response?.data.error === "CometImageResolutionException") {
                        addValidationError(file, <MaxResolutionError maxResolution={context.damConfig.maxSrcResolution} />);
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
                    } else if (typedErr.response?.data.message === "Rejected File Upload: SVG must not contain JavaScript") {
                        addValidationError(file, <SvgContainsJavaScriptError />);
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
        setUploadedSizes({});
        onAfterUpload();

        addNewlyUploadedItems([...uploadedFolders, ...uploadedFiles]);
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
                <ProgressDialog open={progressDialogOpen} totalSize={totalSize} loadedSize={uploadedSize} />
            </>
        ),
        dropzoneConfig: {
            accept: accept,
            multiple: true,
            maxSize: maxFileSizeInBytes,
        },
        newlyUploadedItems,
    };
};
