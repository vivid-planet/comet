import { PrettyBytes } from "@comet/admin";
import { Delete, Select } from "@comet/admin-icons";
import { Button, Chip, ComponentsOverrides, FormHelperText, IconButton, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

export type FinalFormFileUploadClassKey = "root" | "droppableArea" | "droppableAreaCaption" | "fileList" | "fileListItem" | "disabled" | "error";

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
        disabled: {},
        error: {},
    });
};

export interface FinalFormFileUploadProps extends FieldRenderProps<File[], HTMLInputElement> {
    dropzoneVariant: "dropzoneOnly" | "buttonOnly" | "default";
    caption: React.ReactNode;
    multipleFiles: boolean;
    accept: Accept;
    maxSize: number;
}

const FinalFormFileUploadComponent: React.FunctionComponent<WithStyles<typeof styles> & FinalFormFileUploadProps> = ({
    classes,
    disabled,
    dropzoneVariant,
    caption,
    multipleFiles = true,
    accept,
    maxSize,
    input: { name, onChange, value: fieldValue },
}) => {
    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            onChange([...fieldValue, ...acceptedFiles]);
        },
        [fieldValue, onChange],
    );

    const removeFile = (file: File) => () => {
        const newFiles = [...fieldValue];
        newFiles.splice(newFiles.indexOf(file), 1);
        onChange(newFiles);
    };

    const { acceptedFiles, getRootProps, getInputProps, isDragReject } = useDropzone({ onDrop, accept, disabled, multiple: multipleFiles });

    // list of the accepted files
    const files =
        fieldValue.length > 0 &&
        fieldValue.map((file) => (
            <div key={file.name} className={classes.fileListItem}>
                {file.name.length < 20 ? file.name : `${file.name.substring(0, 20)}...`}
                <div>
                    <Chip label={<PrettyBytes value={file.size} />} />
                    <IconButton onClick={removeFile(file)}>
                        <Delete />
                    </IconButton>
                </div>
            </div>
        ));

    return (
        <div className={classes.root}>
            <div {...getRootProps()} className={classes.root}>
                <input {...getInputProps()} />
                {dropzoneVariant !== "buttonOnly" && (
                    <div className={clsx(classes.droppableArea, disabled && classes.disabled, isDragReject && classes.error)}>
                        <div className={classes.droppableAreaCaption}>
                            <FormattedMessage id="comet.finalformfileupload.dropfiles" defaultMessage="Drop files here to upload" />
                        </div>
                    </div>
                )}
                {dropzoneVariant !== "dropzoneOnly" && (
                    <Button disabled={disabled} variant="contained" color="primary" startIcon={<Select />}>
                        <FormattedMessage id="comet.finalformfileupload.selectfile" defaultMessage="Select file" />
                    </Button>
                )}
            </div>
            {acceptedFiles.length > 0 && <div className={classes.fileList}>{files}</div>}
            {caption && <FormHelperText>{caption}</FormHelperText>}
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
