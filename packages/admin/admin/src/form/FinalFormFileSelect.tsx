import { Delete, Error, Select } from "@comet/admin-icons";
import { Button, Chip, ComponentsOverrides, FormHelperText, IconButton, Typography } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { PrettyBytes } from "../helpers/PrettyBytes";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import * as React from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { Alert } from "../alert/Alert";
import { Tooltip } from "../common/Tooltip";

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
    | "selectButton";

type OwnerState = { droppableAreaIsDisabled: boolean; droppableAreaHasError: boolean };

const Root = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(
    () => css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    `,
);

const Dropzone = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "dropzone",
    overridesResolver(_, styles) {
        return [styles.dropzone];
    },
})(
    () => css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        width: 100%;
    `,
);

const DroppableArea = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "droppableArea",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.droppableArea];
    },
})<{ ownerState: OwnerState }>(
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

const DroppableAreaCaption = styled(Typography, {
    name: "CometAdminFinalFormFileSelect",
    slot: "droppableAreaCaption",
    overridesResolver(_, styles) {
        return [styles.droppableAreaCaption];
    },
})(
    ({ theme }) => css`
        padding: 30px;
        color: ${theme.palette.grey[400]};
    `,
);

const DroppableAreaError = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "droppableAreaError",
    overridesResolver(_, styles) {
        return [styles.droppableAreaError];
    },
})(
    ({ theme }) => css`
        position: absolute;
        top: 0;
        right: 0;
        padding: 10px;
        color: ${theme.palette.error.main};
    `,
);

const FileList = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "fileList",
    overridesResolver(_, styles) {
        return [styles.fileList];
    },
})(
    () => css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        width: 100%;
    `,
);

const FileListItem = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "fileListItem",
    overridesResolver(_, styles) {
        return [styles.fileListItem];
    },
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

const FileListItemInfos = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "fileListItemInfos",
    overridesResolver(_, styles) {
        return [styles.fileListItemInfos];
    },
})(
    () => css`
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 10px;
    `,
);

const RejectedFileListItem = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "rejectedFileListItem",
    overridesResolver(_, styles) {
        return [styles.rejectedFileListItem];
    },
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

const ErrorMessage = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "errorMessage",
    overridesResolver(_, styles) {
        return [styles.errorMessage];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        color: ${theme.palette.error.main};
        gap: 5px;
    `,
);

const FileListText = styled("div", {
    name: "CometAdminFinalFormFileSelect",
    slot: "fileListText",
    overridesResolver(_, styles) {
        return [styles.fileListText];
    },
})(
    () => css`
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    `,
);

const SelectButton = styled(Button, {
    name: "CometAdminFinalFormFileSelect",
    slot: "selectButton",
    overridesResolver(_, styles) {
        return [styles.selectButton];
    },
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
        <RejectedFileListItem key={index}>
            <Tooltip trigger="hover" title={rejectedFile.file.name}>
                <FileListText>{rejectedFile.file.name}</FileListText>
            </Tooltip>
            {errorIcon}
        </RejectedFileListItem>
    ));

    return (
        <Root {...restProps}>
            {maxFiles && fieldValue.length >= maxFiles ? (
                <Alert title={<FormattedMessage id="comet.finalFormFileSelect.maximumReached" defaultMessage="Maximum reached" />} severity="info">
                    <FormattedMessage
                        id="comet.finalFormFileSelect.maximumFilesAmount"
                        defaultMessage="The maximum number of uploads has been reached. Please delete files from the list before uploading new files."
                    />
                </Alert>
            ) : (
                <Dropzone {...getRootProps()}>
                    <input {...getInputProps()} />
                    {!disableDropzone && (
                        <DroppableArea ownerState={ownerState}>
                            {isDragReject && <DroppableAreaError>{errorIcon}</DroppableAreaError>}
                            <DroppableAreaCaption variant="body2">
                                <FormattedMessage id="comet.finalFormFileSelect.dropfiles" defaultMessage="Drop files here to upload" />
                            </DroppableAreaCaption>
                        </DroppableArea>
                    )}
                    {!disableSelectFileButton && (
                        <SelectButton disabled={dropzoneDisabled} variant="contained" color="secondary" startIcon={selectIcon}>
                            <FormattedMessage id="comet.finalFormFileSelect.selectfile" defaultMessage="Select file" />
                        </SelectButton>
                    )}
                </Dropzone>
            )}
            {acceptedFiles.length > 0 && (
                <FileList>
                    {acceptedFiles.map((file, index) => (
                        <FileListItem key={index}>
                            <Tooltip trigger="hover" title={file.name}>
                                <FileListText>{file.name}</FileListText>
                            </Tooltip>
                            <FileListItemInfos>
                                <Chip label={<PrettyBytes value={file.size} />} />
                                <IconButton onClick={removeFile(file)}>{deleteIcon}</IconButton>
                            </FileListItemInfos>
                        </FileListItem>
                    ))}
                </FileList>
            )}
            {fileRejections.length > 0 && <FileList>{rejectedFiles}</FileList>}
            {(fileRejections.length > 0 || isDragReject) && (
                <ErrorMessage>
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
