import { Button, Chip, ComponentsOverrides, FormHelperText, IconButton, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import Dropzone from "react-dropzone";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { Delete, Error, Select } from "../../../admin-icons/lib";

export type FinalFormFileUploadClassKey = "root" | "dropableArea" | "dropableAreaCaption" | "fileList" | "fileListItem" | "disabled";

const styles = ({ palette }: Theme) => {
    return createStyles<FinalFormFileUploadClassKey, FinalFormFileUploadProps>({
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
            alignSelf: "stretch",
            width: "250px",
        },
        dropableArea: {
            display: "flex",
            height: "80px",
            padding: "10px",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
            borderRadius: "4px",
            border: `1px dashed ${palette.text.secondary}`,
            cursor: "pointer",
            "&$disabled": {
                cursor: "default",
            },
        },
        dropableAreaCaption: {
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
            padding: "0px 7px 0px 15px",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
            borderRadius: "4px",
            background: palette.background.default,
            justifyContent: "space-between",
        },
        disabled: {},
    });
};

export interface FinalFormFileUploadProps extends FieldRenderProps<HTMLInputElement> {
    dropzoneVariant: "dropzoneOnly" | "buttonOnly" | "default";
    caption: React.ReactNode;
    multiple: boolean;
}

const FinalFormFileUploadComponent: React.FunctionComponent<WithStyles<typeof styles> & FinalFormFileUploadProps> = ({
    classes,
    disabled,
    dropzoneVariant,
    caption,
    multiple = true,
    input: { name, onChange, value: fieldValue },
}) => {
    return (
        <Dropzone disabled={disabled} multiple={multiple} onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => {
                return (
                    <div {...getRootProps()} className={classes.root}>
                        <input {...getInputProps()} />
                        {dropzoneVariant !== "buttonOnly" && (
                            <div className={clsx(classes.dropableArea, disabled && classes.disabled)}>
                                <div className={classes.dropableAreaCaption}>
                                    <FormattedMessage id="comet.finalformfileupload.dropfiles" defaultMessage="Drop files here to upload" />
                                </div>
                            </div>
                        )}
                        {dropzoneVariant !== "dropzoneOnly" && (
                            <Button disabled={disabled} variant="contained" color="primary" startIcon={<Select />}>
                                <FormattedMessage id="comet.finalformfileupload.selectfile" defaultMessage="Select file" />
                            </Button>
                        )}
                        {/* {errors.map((c, i) => (
                            <div key={i}>
                                <FormattedMessage id="comet.finalformfileupload.error" defaultMessage="Error" />: {c.file.name}, {c.error.message}
                            </div>
                        ))} */}
                        <div className={classes.fileList}>
                            <div className={classes.fileListItem}>
                                <FormattedMessage id="comet.finalformfileupload.filename" defaultMessage="Filename.xyz" />
                                <div>
                                    <Chip label="1,8 MB" />
                                    <IconButton>
                                        <Delete />
                                    </IconButton>
                                </div>
                            </div>
                            <div className={classes.fileListItem}>
                                <FormattedMessage id="comet.finalformfileupload.filename" defaultMessage="Filename.xyz" />
                                <div>
                                    <IconButton>
                                        <Error />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                        {/* <div className={classes.fileList}>
                            {value.map((file) => {
                                return (
                                    <div key={file.id} className={classes.fileListItem}>
                                        {file.name}
                                        <div>
                                            <Chip label={file.size} />
                                            <IconButton>
                                                <Delete />
                                            </IconButton>
                                        </div>
                                    </div>
                                );
                            })}
                        </div> */}
                        {caption && <FormHelperText>{caption}</FormHelperText>}
                    </div>
                );
            }}
        </Dropzone>
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
