import { Delete, Info, Select } from "@comet/admin-icons";
import { Button, Chip, ComponentsOverrides, FormHelperText, IconButton } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { PrettyBytes } from "../helpers/PrettyBytes";

export type FinalFormChooseFileFieldClassKey =
    | "root"
    | "droppableArea"
    | "droppableAreaCaption"
    | "droppableAreaError"
    | "fileList"
    | "fileListItem"
    | "fileListItemInfos"
    | "rejectedFileListItem"
    | "errorMessage"
    | "disabled"
    | "error"
    | "fileListText";

type OwnerState = { disabled: boolean; error: boolean };

const Root = styled("div", {
    name: "CometAdminFinalFormChooseFileField",
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
        min-width: 350px;
    `,
);

const DroppableArea = styled("div", {
    name: "CometAdminFinalFormChooseFileField",
    slot: "droppableArea",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.droppableArea];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        position: relative;
        display: flex;
        height: 80px;
        padding: 10px;
        justify-content: center;
        align-items: center;
        align-self: stretch;
        border-radius: 4px;
        border: 1px dashed ${theme.palette.text.secondary};
        cursor: pointer;
        min-width: 250px;

        ${ownerState.disabled &&
        css`
            cursor: default;
        `}
        ${ownerState.error &&
        css`
            border: 1px dashed ${theme.palette.error.main};
        `}
    `,
);

const DroppableAreaCaption = styled("div", {
    name: "CometAdminFinalFormChooseFileField",
    slot: "droppableAreaCaption",
    overridesResolver(_, styles) {
        return [styles.droppableAreaCaption];
    },
})(
    ({ theme }) => css`
        color: ${theme.palette.text.secondary};
        font-size: 14px;
        font-style: normal;
        font-weight: 300;
        line-height: 20px;
    `,
);

const DroppableAreaError = styled("div", {
    name: "CometAdminFinalFormChooseFileField",
    slot: "droppableAreaError",
    overridesResolver(_, styles) {
        return [styles.droppableAreaError];
    },
})(
    ({ theme }) => css`
        float: right;
        position: absolute;
        top: 0;
        right: 0;
        padding: 10px;
        color: ${theme.palette.error.main};
    `,
);

const FileList = styled("div", {
    name: "CometAdminFinalFormChooseFileField",
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
    name: "CometAdminFinalFormChooseFileField",
    slot: "fileListItem",
    overridesResolver(_, styles) {
        return [styles.fileListItem];
    },
})(
    ({ theme }) => css`
        display: flex;
        padding: 8px 7px 8px 15px;
        align-items: center;
        gap: 10px;
        border-radius: 4px;
        background: ${theme.palette.background.default};
        justify-content: space-between;
        min-width: 250px;
        width: 100%;
        box-sizing: border-box;
    `,
);

const FileListItemInfos = styled("div", {
    name: "CometAdminFinalFormChooseFileField",
    slot: "fileListItemInfos",
    overridesResolver(_, styles) {
        return [styles.fileListItemInfos];
    },
})(
    () => css`
        display: flex;
        justify-content: end;
        gap: 10px;
    `,
);

const RejectedFileListItem = styled("div", {
    name: "CometAdminFinalFormChooseFileField",
    slot: "rejectedFileListItem",
    overridesResolver(_, styles) {
        return [styles.rejectedFileListItem];
    },
})(
    ({ theme }) => css`
        display: flex;
        padding: 8px 7px 8px 15px;
        align-items: center;
        gap: 10px;
        border-radius: 4px;
        background: ${theme.palette.background.default};
        justify-content: space-between;
        min-width: 250px;
        width: 100%;
        box-sizing: border-box;
        border: 1px dashed ${theme.palette.error.main};
        color: ${theme.palette.error.main};
    `,
);

const ErrorMessage = styled("div", {
    name: "CometAdminFinalFormChooseFileField",
    slot: "errorMessage",
    overridesResolver(_, styles) {
        return [styles.errorMessage];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: 5px;
        color: ${theme.palette.error.main};
    `,
);

const FileListText = styled("div", {
    name: "CometAdminFinalFormChooseFileField",
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

export interface FinalFormChooseFileFieldProps
    extends FieldRenderProps<File | File[], HTMLInputElement>,
        ThemedComponentBaseProps<{
            root: "div";
            droppableArea: "div";
            droppableAreaCaption: "div";
            droppableAreaError: "div";
            fileList: "div";
            fileListItem: "div";
            fileListItemInfos: "div";
            rejectedFileListItem: "div";
            errorMessage: "div";
            fileListText: "div";
        }> {
    disableDropzone?: boolean;
    disableButton?: boolean;
    accept: Accept;
    maxSize: number;
    maxFiles?: number;
}

export function FinalFormChooseFileField(inProps: FinalFormChooseFileFieldProps) {
    const {
        disabled,
        disableDropzone,
        disableButton,
        accept,
        maxSize = 50 * 1024 * 1024,
        maxFiles,
        input: { onChange, value: fieldValue, multiple: multipleFiles },
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminFinalFormChooseFileField",
    });

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            multipleFiles && Array.isArray(fieldValue)
                ? maxFiles && fieldValue.length < maxFiles && fieldValue.length + acceptedFiles.length <= maxFiles
                    ? onChange([...fieldValue, ...acceptedFiles])
                    : onChange([...acceptedFiles])
                : onChange([...acceptedFiles]);
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
        disabled: disabled || (maxFiles && fieldValue.length === maxFiles),
        multiple: multipleFiles,
        maxSize: maxSize,
        maxFiles,
    });

    const ownerState: OwnerState = {
        disabled,
        error: isDragReject,
    };

    // list of the accepted files
    let files: File[];

    if (Array.isArray(fieldValue)) {
        files = fieldValue;
    } else if (fieldValue.name !== undefined) {
        files = [fieldValue];
    } else {
        files = [];
    }

    const rejectedFiles =
        fileRejections.length > 0 &&
        fileRejections.map((rejectedFile) => (
            <RejectedFileListItem key={rejectedFile.file.name}>
                <FileListText>{rejectedFile.file.name}</FileListText>
                <IconButton color="error">
                    <Info />
                </IconButton>
            </RejectedFileListItem>
        ));

    return (
        <Root {...restProps}>
            <Root {...getRootProps()} {...restProps}>
                <input {...getInputProps()} />
                {!disableDropzone && (
                    <DroppableArea ownerState={ownerState}>
                        {isDragReject && (
                            <DroppableAreaError>
                                <Info />
                            </DroppableAreaError>
                        )}
                        <DroppableAreaCaption>
                            <FormattedMessage id="comet.finalFormChooseFileField.dropfiles" defaultMessage="Drop files here to upload" />
                        </DroppableAreaCaption>
                    </DroppableArea>
                )}
                {!disableButton && (
                    <Button disabled={disabled} variant="contained" color="primary" startIcon={<Select />}>
                        <FormattedMessage id="comet.finalFormChooseFileField.selectfile" defaultMessage="Select file" />
                    </Button>
                )}
            </Root>
            {files.length > 0 && (
                <FileList>
                    {files.map((file) => (
                        <FileListItem key={file.name}>
                            <FileListText>{file.name}</FileListText>
                            <FileListItemInfos>
                                <Chip label={<PrettyBytes value={file.size} />} />
                                <IconButton onClick={removeFile(file)}>
                                    <Delete />
                                </IconButton>
                            </FileListItemInfos>
                        </FileListItem>
                    ))}
                </FileList>
            )}
            {fileRejections.length > 0 && <FileList>{rejectedFiles}</FileList>}
            {(fileRejections.length > 0 || isDragReject) && (
                <ErrorMessage>
                    <Info color="error" />
                    <FormattedMessage id="comet.finalFormChooseFileField.errors.unknownError" defaultMessage="Something went wrong." />
                </ErrorMessage>
            )}
            <FormHelperText>
                <FormattedMessage id="comet.finalFormChooseFileField.maximumFileSize" defaultMessage="Maximum file size" />{" "}
                <PrettyBytes value={maxSize} />
            </FormHelperText>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormChooseFileField: FinalFormChooseFileFieldClassKey;
    }

    interface Components {
        CometAdminFinalFormChooseFileField?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFinalFormChooseFileField"];
        };
    }
}
