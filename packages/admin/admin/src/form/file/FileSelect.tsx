import { Error as ErrorIcon } from "@comet/admin-icons";
import { ComponentsOverrides, FormHelperText, Typography } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { Accept, DropzoneOptions } from "react-dropzone";
import { FormattedMessage } from "react-intl";

import { Alert } from "../../alert/Alert";
import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { FileDropzone } from "./FileDropzone";
import { FileSelectItem } from "./fileSelectItemTypes";
import { FileSelectListItem } from "./FileSelectListItem";
import { getFilesInfoText } from "./getFilesInfoText";

export type FileSelectClassKey =
    | "root"
    | "maxFilesReachedInfo"
    | "dropzone"
    | "fileList"
    | "fileListItem"
    | "error"
    | "errorMessage"
    | "filesInfoText";

type ThemeProps = ThemedComponentBaseProps<{
    root: "div";
    maxFilesReachedInfo: typeof Alert;
    dropzone: typeof FileDropzone;
    fileList: "div";
    fileListItem: typeof FileSelectListItem;
    error: "div";
    errorMessage: typeof Typography;
    filesInfoText: typeof FormHelperText;
}>;

export type FileSelectProps<AdditionalValidFileValues = Record<string, unknown>> = {
    files: FileSelectItem<AdditionalValidFileValues>[];
    onDrop: DropzoneOptions["onDrop"];
    onRemove: (file: FileSelectItem<AdditionalValidFileValues>) => void;
    onDownload?: (file: FileSelectItem<AdditionalValidFileValues>) => void;
    disabled?: boolean;
    accept?: Accept;
    maxFileSize?: number;
    maxFiles?: number;
    error?: React.ReactNode;
    iconMapping?: {
        error?: React.ReactNode;
    };
} & ThemeProps;

export const FileSelect = <AdditionalValidFileValues = Record<string, unknown>,>(inProps: FileSelectProps<AdditionalValidFileValues>) => {
    const {
        slotProps,
        disabled,
        accept,
        maxFileSize,
        maxFiles,
        iconMapping = {},
        onDrop,
        onRemove,
        onDownload,
        files,
        error,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFileSelect",
    });

    const { error: errorIcon = <ErrorIcon color="error" /> } = iconMapping;

    const multiple = typeof maxFiles === "number" && maxFiles > 1;
    const numberOfValidFiles = files?.filter((file) => !("error" in file)).length ?? 0;
    const maxAmountOfFilesSelected = typeof maxFiles !== "undefined" && multiple && numberOfValidFiles >= maxFiles;
    const maxNumberOfFilesToBeAdded = maxFiles ? maxFiles - numberOfValidFiles : undefined;
    const filesInfoText = getFilesInfoText(maxFiles, maxFileSize);

    return (
        <Root {...slotProps?.root} {...restProps}>
            {maxAmountOfFilesSelected ? (
                <MaxFilesReachedInfo
                    title={<FormattedMessage id="comet.fileSelect.maximumReached" defaultMessage="Maximum reached" />}
                    severity="info"
                    {...slotProps?.maxFilesReachedInfo}
                >
                    <FormattedMessage
                        id="comet.fileSelect.maximumFilesAmount"
                        defaultMessage="The maximum number of uploads has been reached. Please delete files from the list before uploading new files."
                    />
                </MaxFilesReachedInfo>
            ) : (
                <Dropzone
                    disabled={disabled}
                    hasError={Boolean(error)}
                    onDrop={onDrop}
                    accept={accept}
                    multiple={multiple}
                    maxSize={maxFileSize}
                    maxFiles={maxNumberOfFilesToBeAdded}
                    {...slotProps?.dropzone}
                />
            )}
            {files.length > 0 && (
                <FileList {...slotProps?.fileList}>
                    {files.map((file, index) => {
                        return (
                            <FileListItem
                                key={index}
                                file={file}
                                onClickDownload={
                                    "error" in file || !onDownload
                                        ? undefined
                                        : () => {
                                              onDownload(file);
                                          }
                                }
                                onClickDelete={() => onRemove(file)}
                                {...slotProps?.fileListItem}
                            />
                        );
                    })}
                </FileList>
            )}
            {Boolean(error) && (
                <Error {...slotProps?.error}>
                    {errorIcon}
                    <ErrorMessage variant="caption" color="error" {...slotProps?.errorMessage}>
                        {error}
                    </ErrorMessage>
                </Error>
            )}
            {Boolean(filesInfoText) && <FilesInfoText {...slotProps?.filesInfoText}>{filesInfoText}</FilesInfoText>}
        </Root>
    );
};

const Root = createComponentSlot("div")<FileSelectClassKey>({
    componentName: "FileSelect",
    slotName: "root",
})(css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`);

const Dropzone = createComponentSlot(FileDropzone)<FileSelectClassKey>({
    componentName: "FileSelect",
    slotName: "dropzone",
})();

const FileList = createComponentSlot("div")<FileSelectClassKey>({
    componentName: "FileSelect",
    slotName: "fileList",
})(css`
    width: 100%;
`);

const FileListItem = createComponentSlot(FileSelectListItem)<FileSelectClassKey>({
    componentName: "FileSelect",
    slotName: "fileListItem",
})();

const MaxFilesReachedInfo = createComponentSlot(Alert)<FileSelectClassKey>({
    componentName: "FileSelect",
    slotName: "maxFilesReachedInfo",
})(css`
    width: 100%;
    box-sizing: border-box;
`);

const Error = createComponentSlot("div")<FileSelectClassKey>({
    componentName: "FileSelect",
    slotName: "error",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        color: ${theme.palette.error.main};
        gap: 5px;
    `,
);

const ErrorMessage = createComponentSlot(Typography)<FileSelectClassKey>({
    componentName: "FileSelect",
    slotName: "errorMessage",
})();

const FilesInfoText = createComponentSlot(FormHelperText)<FileSelectClassKey>({
    componentName: "FileSelect",
    slotName: "filesInfoText",
})(css`
    margin: 0;
`);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFileSelect: FileSelectClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFileSelect: FileSelectProps;
    }

    interface Components {
        CometAdminFileSelect?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFileSelect"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFileSelect"];
        };
    }
}
