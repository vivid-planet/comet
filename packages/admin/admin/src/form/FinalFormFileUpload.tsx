import { Delete, Info, Select } from "@comet/admin-icons";
import { Button, Chip, ComponentsOverrides, FormHelperText, IconButton, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { PrettyBytes } from "../helpers/PrettyBytes";

export type FinalFormFileUploadClassKey =
    | "root"
    | "droppableArea"
    | "droppableAreaCaption"
    | "droppableAreaError"
    | "fileList"
    | "fileListItem"
    | "rejectedFileListItem"
    | "errorMessage"
    | "disabled"
    | "error";

const styles = ({ palette }: Theme) => {
    return createStyles<FinalFormFileUploadClassKey, FinalFormFileUploadProps>({
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
            alignSelf: "stretch",
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
            alignSelf: "stretch",
        },
        fileListItem: {
            display: "flex",
            height: "35px",
            padding: "8px 7px 8px 15px",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
            borderRadius: "4px",
            background: palette.background.default,
            justifyContent: "space-between",
            minWidth: "250px",
        },
        rejectedFileListItem: {
            display: "flex",
            height: "35px",
            padding: "8px 7px 8px 15px",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
            borderRadius: "4px",
            background: palette.background.default,
            justifyContent: "space-between",
            minWidth: "250px",
            border: `1px dashed ${palette.error.main}`,
            color: palette.error.main,
        },
        errorMessage: {
            display: "flex",
            alignItems: "center",
            alignSelf: "stretch",
            color: palette.error.main,
            gap: "5px",
        },
        disabled: {},
        error: {},
    });
};

export interface FinalFormFileUploadProps extends FieldRenderProps<File | File[], HTMLInputElement> {
    disableDropzone?: boolean;
    disableButton?: boolean;
    accept: Accept;
    maxSize: number;
}

const FinalFormFileUploadComponent: React.FunctionComponent<WithStyles<typeof styles> & FinalFormFileUploadProps> = ({
    classes,
    disabled,
    disableDropzone,
    disableButton,
    accept,
    maxSize = 50 * 1024 * 1024,
    input: { onChange, value: fieldValue, multiple: multipleFiles },
}) => {
    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            multipleFiles && Array.isArray(fieldValue) ? onChange([...fieldValue, ...acceptedFiles]) : onChange([...acceptedFiles]);
        },
        [fieldValue, multipleFiles, onChange],
    );

    const removeFile = (removedFile: File) => () => {
        const newFiles = Array.isArray(fieldValue) ? fieldValue.filter((file) => file !== removedFile) : undefined;
        onChange(newFiles);
    };

    const { fileRejections, getRootProps, getInputProps, isDragReject } = useDropzone({
        onDrop,
        accept,
        disabled,
        multiple: multipleFiles,
        maxSize: maxSize,
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
                {rejectedFile.file.name.length < 20 ? rejectedFile.file.name : `${rejectedFile.file.name.substring(0, 20)}...`}
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
                            <FormattedMessage id="comet.finalformfileupload.dropfiles" defaultMessage="Drop files here to upload" />
                        </div>
                    </div>
                )}
                {!disableButton && (
                    <Button disabled={disabled} variant="contained" color="primary" startIcon={<Select />}>
                        <FormattedMessage id="comet.finalformfileupload.selectfile" defaultMessage="Select file" />
                    </Button>
                )}
            </div>
            {files.length > 0 && (
                <div className={classes.fileList}>
                    {files.map((file) => (
                        <div key={file.name} className={classes.fileListItem}>
                            {file.name.length < 20 ? file.name : `${file.name.substring(0, 20)}...`}
                            <div>
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
                    <FormattedMessage id="comet.finalformfileupload.errors.unknownError" defaultMessage="Something went wrong." />
                </div>
            )}
            <FormHelperText>
                <FormattedMessage id="comet.finalformfileupload.maximumFileSize" defaultMessage="Maximum file size" /> <PrettyBytes value={maxSize} />
            </FormHelperText>
        </div>
    );
};

export const FinalFormFileUpload = withStyles(styles, { name: "CometAdminFinalFormFileUpload" })(FinalFormFileUploadComponent);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormFileUpload: FinalFormFileUploadClassKey;
    }

    interface Components {
        CometAdminFinalFormFileUpload?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFinalFormFileUpload"];
        };
    }
}
