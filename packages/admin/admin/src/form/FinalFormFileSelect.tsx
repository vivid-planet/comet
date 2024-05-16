import { Delete, Error, Select } from "@comet/admin-icons";
import { Button, Chip, ComponentsOverrides, FormHelperText, IconButton, Typography } from "@mui/material";
import { css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { Alert } from "../alert/Alert";
import { Tooltip } from "../common/Tooltip";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { PrettyBytes } from "../helpers/PrettyBytes";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type FinalFormFileSelectClassKey =
    | "root"
    | "dropzone"
    | "droppableArea"
    | "droppableAreaCaption"
    | "droppableAreaError"
    | "fileList"
    | "fileListItem"
    | "fileListItemInfos"
    | "rejectedFileListItem"
    | "errorMessage"
    | "fileListText"
    | "selectButton"
    | "droppableAreaIsDisabled"
    | "droppableAreaHasError";

type OwnerState = { droppableAreaIsDisabled: boolean; droppableAreaHasError: boolean };

const Root = createComponentSlot("div")<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "root",
})(
    () => css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    `,
);

const Dropzone = createComponentSlot("div")<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "dropzone",
})(
    () => css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        width: 100%;
    `,
);

const DroppableArea = createComponentSlot("div")<FinalFormFileSelectClassKey, OwnerState>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "droppableArea",
    classesResolver(ownerState) {
        return [ownerState.droppableAreaHasError && "droppableAreaHasError", ownerState.droppableAreaIsDisabled && "droppableAreaIsDisabled"];
    },
})(
    ({ theme, ownerState }) => css`
        position: relative;
        display: flex;
        height: 80px;
        justify-content: center;
        align-items: center;
        align-self: stretch;
        border-radius: 4px;
        border: 1px dashed ${theme.palette.grey[200]};
        cursor: pointer;
        ${ownerState.droppableAreaIsDisabled &&
        css`
            cursor: default;
        `}
        ${ownerState.droppableAreaHasError &&
        css`
            border: 1px dashed ${theme.palette.error.main};
        `}
    `,
);

const DroppableAreaCaption = createComponentSlot(Typography)<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "droppableAreaCaption",
})(
    ({ theme }) => css`
        padding: 30px;
        color: ${theme.palette.grey[400]};
    `,
);

const DroppableAreaError = createComponentSlot("div")<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "droppableAreaError",
})(
    ({ theme }) => css`
        position: absolute;
        top: 0;
        right: 0;
        padding: 10px;
        color: ${theme.palette.error.main};
    `,
);

const FileList = createComponentSlot("div")<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "fileList",
})(
    () => css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        width: 100%;
    `,
);

const FileListItem = createComponentSlot("div")<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "fileListItem",
})(
    ({ theme }) => css`
        display: flex;
        padding: 4px 7px 4px 15px;
        align-items: center;
        gap: 10px;
        border-radius: 4px;
        background: ${theme.palette.grey[50]};
        justify-content: space-between;
        width: 100%;
        box-sizing: border-box;
    `,
);

const FileListItemInfos = createComponentSlot("div")<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "fileListItemInfos",
})(
    () => css`
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 10px;
    `,
);

const RejectedFileListItem = createComponentSlot("div")<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "rejectedFileListItem",
})(
    ({ theme }) => css`
        display: flex;
        padding: 9px 15px;
        align-items: center;
        gap: 10px;
        border-radius: 4px;
        background: ${theme.palette.grey[50]};
        justify-content: space-between;
        border: 1px dashed ${theme.palette.error.main};
        color: ${theme.palette.error.main};
        width: 100%;
        box-sizing: border-box;
    `,
);

const ErrorMessage = createComponentSlot("div")<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "errorMessage",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        color: ${theme.palette.error.main};
        gap: 5px;
    `,
);

const FileListText = createComponentSlot("div")<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "fileListText",
})(
    () => css`
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    `,
);

const SelectButton = createComponentSlot(Button)<FinalFormFileSelectClassKey>({
    componentName: "CometAdminFinalFormFileSelect",
    slotName: "selectButton",
})(
    ({ theme }) => css`
        background-color: ${theme.palette.grey[800]};
        color: ${theme.palette.common.white};
        gap: 5px;
        &:hover {
            background-color: ${theme.palette.grey[800]};
            color: ${theme.palette.common.white};
        }
    `,
);

export interface FinalFormFileSelectProps
    extends FieldRenderProps<File | File[], HTMLInputElement>,
        ThemedComponentBaseProps<{
            root: "div";
            dropzone: "div";
            droppableArea: "div";
            droppableAreaCaption: typeof Typography;
            droppableAreaError: "div";
            fileList: "div";
            fileListItem: "div";
            fileListItemInfos: "div";
            rejectedFileListItem: "div";
            errorMessage: "div";
            fileListText: "div";
            selectButton: typeof Button;
        }> {
    disableDropzone?: boolean;
    disableSelectFileButton?: boolean;
    accept?: Accept;
    maxSize?: number;
    maxFiles?: number;
    iconMapping?: {
        delete?: React.ReactNode;
        error?: React.ReactNode;
        select?: React.ReactNode;
    };
}

export function FinalFormFileSelect(inProps: FinalFormFileSelectProps) {
    const {
        slotProps,
        disabled,
        disableDropzone,
        disableSelectFileButton,
        accept,
        maxSize = 50 * 1024 * 1024,
        maxFiles,
        input: { onChange, value: fieldValue, multiple: multipleFiles },
        iconMapping = {},
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFinalFormFileSelect",
    });

    const { delete: deleteIcon = <Delete />, error: errorIcon = <Error color="error" />, select: selectIcon = <Select /> } = iconMapping;

    const dropzoneDisabled = disabled || (maxFiles && fieldValue.length >= maxFiles);

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            if (multipleFiles) {
                if (Array.isArray(fieldValue)) {
                    if (!maxFiles || (maxFiles && fieldValue.length < maxFiles && fieldValue.length + acceptedFiles.length <= maxFiles)) {
                        onChange([...fieldValue, ...acceptedFiles]);
                    }
                } else {
                    onChange([...acceptedFiles]);
                }
            } else {
                onChange(acceptedFiles[0]);
            }
        },
        [fieldValue, multipleFiles, onChange, maxFiles],
    );

    const removeFile = (removedFile: File) => () => {
        const newFiles = Array.isArray(fieldValue) ? fieldValue.filter((file) => file !== removedFile) : undefined;
        onChange(newFiles);
    };

    const { fileRejections, getRootProps, getInputProps, isDragReject } = useDropzone({
        onDrop,
        accept,
        disabled: dropzoneDisabled,
        multiple: multipleFiles,
        maxSize: maxSize,
        maxFiles,
    });

    const ownerState: OwnerState = {
        droppableAreaIsDisabled: dropzoneDisabled,
        droppableAreaHasError: isDragReject,
    };

    let acceptedFiles: File[] = [];

    if (Array.isArray(fieldValue)) {
        acceptedFiles = fieldValue;
    } else if (fieldValue.name !== undefined) {
        acceptedFiles = [fieldValue];
    }

    const rejectedFiles = fileRejections.map((rejectedFile, index) => (
        <RejectedFileListItem {...slotProps?.rejectedFileListItem} key={index}>
            <Tooltip trigger="hover" title={rejectedFile.file.name}>
                <FileListText {...slotProps?.fileListText}>{rejectedFile.file.name}</FileListText>
            </Tooltip>
            {errorIcon}
        </RejectedFileListItem>
    ));

    return (
        <Root {...slotProps?.root} {...restProps}>
            {maxFiles && fieldValue.length >= maxFiles ? (
                <Alert title={<FormattedMessage id="comet.finalFormFileSelect.maximumReached" defaultMessage="Maximum reached" />} severity="info">
                    <FormattedMessage
                        id="comet.finalFormFileSelect.maximumFilesAmount"
                        defaultMessage="The maximum number of uploads has been reached. Please delete files from the list before uploading new files."
                    />
                </Alert>
            ) : (
                <Dropzone {...slotProps?.dropzone} {...getRootProps()}>
                    <input {...getInputProps()} />
                    {!disableDropzone && (
                        <DroppableArea {...slotProps?.droppableArea} ownerState={ownerState}>
                            {isDragReject && <DroppableAreaError {...slotProps?.droppableAreaError}>{errorIcon}</DroppableAreaError>}
                            <DroppableAreaCaption {...slotProps?.droppableAreaCaption} variant="body2">
                                <FormattedMessage id="comet.finalFormFileSelect.dropfiles" defaultMessage="Drop files here to upload" />
                            </DroppableAreaCaption>
                        </DroppableArea>
                    )}
                    {!disableSelectFileButton && (
                        <SelectButton
                            {...slotProps?.selectButton}
                            disabled={dropzoneDisabled}
                            variant="contained"
                            color="secondary"
                            startIcon={selectIcon}
                        >
                            <FormattedMessage id="comet.finalFormFileSelect.selectfile" defaultMessage="Select file" />
                        </SelectButton>
                    )}
                </Dropzone>
            )}
            {acceptedFiles.length > 0 && (
                <FileList {...slotProps?.fileList}>
                    {acceptedFiles.map((file, index) => (
                        <FileListItem {...slotProps?.fileListItem} key={index}>
                            <Tooltip trigger="hover" title={file.name}>
                                <FileListText {...slotProps?.fileListText}>{file.name}</FileListText>
                            </Tooltip>
                            <FileListItemInfos {...slotProps?.fileListItemInfos}>
                                <Chip label={<PrettyBytes value={file.size} />} />
                                <IconButton onClick={removeFile(file)}>{deleteIcon}</IconButton>
                            </FileListItemInfos>
                        </FileListItem>
                    ))}
                </FileList>
            )}
            {fileRejections.length > 0 && <FileList>{rejectedFiles}</FileList>}
            {(fileRejections.length > 0 || isDragReject) && (
                <ErrorMessage {...slotProps?.errorMessage}>
                    {errorIcon}
                    <FormattedMessage id="comet.finalFormFileSelect.errors.unknownError" defaultMessage="Something went wrong." />
                </ErrorMessage>
            )}
            <FormHelperText sx={{ margin: 0 }}>
                <FormattedMessage
                    id="comet.finalFormFileSelect.maximumFileSize"
                    defaultMessage="Maximum file size {fileSize}"
                    values={{
                        fileSize: <PrettyBytes value={maxSize} />,
                    }}
                />
            </FormHelperText>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormFileSelect: FinalFormFileSelectClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFinalFormFileSelect: FinalFormFileSelectProps;
    }

    interface Components {
        CometAdminFinalFormFileSelect?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFinalFormFileSelect"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFinalFormFileSelect"];
        };
    }
}
