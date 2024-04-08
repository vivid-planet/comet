import { Delete, Info, Select } from "@comet/admin-icons";
import { Button, Chip, ComponentsOverrides, FormHelperText, IconButton, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
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

const styles = ({ palette }: Theme) => {
    return createStyles<FinalFormChooseFileFieldClassKey, FinalFormChooseFileFieldProps>({
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
            minWidth: "350px",
        },
        droppableArea: {
            position: "relative",
            display: "flex",
            height: "80px",
            padding: "10px",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
            borderRadius: "4px",
            border: `1px dashed ${palette.text.secondary}`,
            cursor: "pointer",
            minWidth: "250px",
            "&$disabled": {
                cursor: "default",
            },
            "&$error": {
                border: `1px dashed ${palette.error.main}`,
            },
        },
        droppableAreaCaption: {
            color: palette.text.secondary,
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "300",
            lineHeight: "20px",
        },
        droppableAreaError: {
            float: "right",
            position: "absolute",
            top: 0,
            right: 0,
            padding: "10px",
            color: palette.error.main,
        },
        fileList: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2px",
            width: "100%",
        },
        fileListItem: {
            display: "flex",
            padding: "8px 7px 8px 15px",
            alignItems: "center",
            gap: "10px",
            borderRadius: "4px",
            background: palette.background.default,
            justifyContent: "space-between",
            minWidth: "250px",
            width: "100%",
            boxSizing: "border-box",
        },
        fileListItemInfos: {
            display: "flex",
            justifyContent: "end",
            gap: "10px",
        },
        rejectedFileListItem: {
            display: "flex",
            padding: "8px 7px 8px 15px",
            alignItems: "center",
            gap: "10px",
            borderRadius: "4px",
            background: palette.background.default,
            justifyContent: "space-between",
            minWidth: "250px",
            border: `1px dashed ${palette.error.main}`,
            color: palette.error.main,
            width: "100%",
            boxSizing: "border-box",
        },
        errorMessage: {
            display: "flex",
            alignItems: "center",
            color: palette.error.main,
            gap: "5px",
        },
        disabled: {},
        error: {},
        fileListText: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
        },
    });
};

export interface FinalFormChooseFileFieldProps extends FieldRenderProps<File | File[], HTMLInputElement> {
    disableDropzone?: boolean;
    disableButton?: boolean;
    accept: Accept;
    maxSize: number;
    maxFiles?: number;
}

const FinalFormChooseFileFieldComponent: React.FunctionComponent<WithStyles<typeof styles> & FinalFormChooseFileFieldProps> = ({
    classes,
    disabled,
    disableDropzone,
    disableButton,
    accept,
    maxSize = 50 * 1024 * 1024,
    maxFiles,
    input: { onChange, value: fieldValue, multiple: multipleFiles },
}) => {
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
            <div key={rejectedFile.file.name} className={classes.rejectedFileListItem}>
                <div className={classes.fileListText}>{rejectedFile.file.name}</div>
                <IconButton color="error">
                    <Info />
                </IconButton>
            </div>
        ));

    return (
        <div className={classes.root}>
            <div {...getRootProps()} className={classes.root}>
                <input {...getInputProps()} />
                {!disableDropzone && (
                    <div className={clsx(classes.droppableArea, disabled && classes.disabled, isDragReject && classes.error)}>
                        {isDragReject && (
                            <div className={classes.droppableAreaError}>
                                <Info />
                            </div>
                        )}
                        <div className={classes.droppableAreaCaption}>
                            <FormattedMessage id="comet.finalFormChooseFileField.dropfiles" defaultMessage="Drop files here to upload" />
                        </div>
                    </div>
                )}
                {!disableButton && (
                    <Button disabled={disabled} variant="contained" color="primary" startIcon={<Select />}>
                        <FormattedMessage id="comet.finalFormChooseFileField.selectfile" defaultMessage="Select file" />
                    </Button>
                )}
            </div>
            {files.length > 0 && (
                <div className={classes.fileList}>
                    {files.map((file) => (
                        <div key={file.name} className={classes.fileListItem}>
                            <div className={classes.fileListText}>{file.name}</div>
                            <div className={classes.fileListItemInfos}>
                                <Chip label={<PrettyBytes value={file.size} />} />
                                <IconButton onClick={removeFile(file)}>
                                    <Delete />
                                </IconButton>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {fileRejections.length > 0 && <div className={classes.fileList}>{rejectedFiles}</div>}
            {(fileRejections.length > 0 || isDragReject) && (
                <div className={classes.errorMessage}>
                    <Info color="error" />
                    <FormattedMessage id="comet.finalFormChooseFileField.errors.unknownError" defaultMessage="Something went wrong." />
                </div>
            )}
            <FormHelperText>
                <FormattedMessage id="comet.finalFormChooseFileField.maximumFileSize" defaultMessage="Maximum file size" />{" "}
                <PrettyBytes value={maxSize} />
            </FormHelperText>
        </div>
    );
};

export const FinalFormChooseFileField = withStyles(styles, { name: "CometAdminFinalFormChooseFileField" })(FinalFormChooseFileFieldComponent);

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
