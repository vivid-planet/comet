import { Delete, Error, Select } from "@comet/admin-icons";
import { Button, Chip, ComponentsOverrides, FormHelperText, IconButton, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { Tooltip } from "../common/Tooltip";
import { PrettyBytes } from "../helpers/PrettyBytes";

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
    | "droppableAreaIsDisabled"
    | "droppableAreaHasError"
    | "fileListText";

const styles = ({ palette }: Theme) => {
    return createStyles<FinalFormFileSelectClassKey, FinalFormFileSelectProps>({
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
        },
        dropzone: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
            width: "100%",
        },
        droppableArea: {
            position: "relative",
            display: "flex",
            height: "80px",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
            borderRadius: "4px",
            border: `1px dashed ${palette.grey[200]}`,
            cursor: "pointer",
            "&$droppableAreaIsDisabled": {
                cursor: "default",
            },
            "&$droppableAreaHasError": {
                border: `1px dashed ${palette.error.main}`,
            },
        },
        droppableAreaCaption: {
            padding: "30px",
            color: palette.grey[400],
        },
        droppableAreaError: {
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
            background: palette.grey[50],
            justifyContent: "space-between",
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
            padding: "14px 15px",
            alignItems: "center",
            gap: "10px",
            borderRadius: "4px",
            background: palette.grey[50],
            justifyContent: "space-between",
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
        droppableAreaIsDisabled: {},
        droppableAreaHasError: {},
        fileListText: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
        },
    });
};

export interface FinalFormFileSelectProps extends FieldRenderProps<File | File[], HTMLInputElement> {
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

const FinalFormFileSelectComponent: React.FunctionComponent<WithStyles<typeof styles> & FinalFormFileSelectProps> = ({
    classes,
    disabled,
    disableDropzone,
    disableSelectFileButton,
    accept,
    maxSize = 50 * 1024 * 1024,
    maxFiles,
    input: { onChange, value: fieldValue, multiple: multipleFiles },
    iconMapping = {},
}) => {
    const { delete: deleteIcon = <Delete />, error: errorIcon = <Error color="error" />, select: selectIcon = <Select /> } = iconMapping;

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
        disabled: disabled || (maxFiles && fieldValue.length >= maxFiles),
        multiple: multipleFiles,
        maxSize: maxSize,
        maxFiles,
    });

    let acceptedFiles: File[] = [];

    if (Array.isArray(fieldValue)) {
        acceptedFiles = fieldValue;
    } else if (fieldValue.name !== undefined) {
        acceptedFiles = [fieldValue];
    }

    const rejectedFiles = fileRejections.map((rejectedFile, index) => (
        <div key={index} className={classes.rejectedFileListItem}>
            <Tooltip trigger="hover" title={rejectedFile.file.name}>
                <div className={classes.fileListText}>{rejectedFile.file.name}</div>
            </Tooltip>
            {errorIcon}
        </div>
    ));

    return (
        <div className={classes.root}>
            <div {...getRootProps()} className={classes.dropzone}>
                <input {...getInputProps()} />
                {!disableDropzone && (
                    <div
                        className={clsx(
                            classes.droppableArea,
                            disabled && classes.droppableAreaIsDisabled,
                            isDragReject && classes.droppableAreaHasError,
                        )}
                    >
                        {isDragReject && <div className={classes.droppableAreaError}>{errorIcon}</div>}
                        <Typography variant="body2" className={classes.droppableAreaCaption}>
                            <FormattedMessage id="comet.finalFormFileSelect.dropfiles" defaultMessage="Drop files here to upload" />
                        </Typography>
                    </div>
                )}
                {!disableSelectFileButton && (
                    <Button disabled={disabled} variant="contained" color="secondary" startIcon={selectIcon}>
                        <FormattedMessage id="comet.finalFormFileSelect.selectfile" defaultMessage="Select file" />
                    </Button>
                )}
            </div>
            {acceptedFiles.length > 0 && (
                <div className={classes.fileList}>
                    {acceptedFiles.map((file, index) => (
                        <div key={index} className={classes.fileListItem}>
                            <Tooltip trigger="hover" title={file.name}>
                                <div className={classes.fileListText}>{file.name}</div>
                            </Tooltip>
                            <div className={classes.fileListItemInfos}>
                                <Chip label={<PrettyBytes value={file.size} />} />
                                <IconButton onClick={removeFile(file)}>{deleteIcon}</IconButton>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {fileRejections.length > 0 && <div className={classes.fileList}>{rejectedFiles}</div>}
            {(fileRejections.length > 0 || isDragReject) && (
                <div className={classes.errorMessage}>
                    {errorIcon}
                    <FormattedMessage id="comet.finalFormFileSelect.errors.unknownError" defaultMessage="Something went wrong." />
                </div>
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
        </div>
    );
};

export const FinalFormFileSelect = withStyles(styles, { name: "CometAdminFinalFormFileSelect" })(FinalFormFileSelectComponent);

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
