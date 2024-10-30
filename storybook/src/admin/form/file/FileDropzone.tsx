import { FileDropzone, FileDropzoneProps } from "@comet/admin";
import { Card, CardContent, Stack } from "@mui/material";
import { ComponentMeta } from "@storybook/react";
import React from "react";

type FileRejections = Parameters<Required<FileDropzoneProps>["onDropRejected"]>[0];

export default {
    title: "@comet/admin/form/File",
    decorators: [
        (story) => (
            <Card sx={{ maxWidth: 440 }}>
                <CardContent>
                    <Stack spacing={4}>{story()}</Stack>
                </CardContent>
            </Card>
        ),
    ],
    args: {
        disabled: false,
        multiple: false,
        hasError: false,
    },
    argTypes: {
        disabled: {
            name: "Disabled",
            control: "boolean",
        },
        multiple: {
            name: "Multiple",
            control: "boolean",
        },
        hasError: {
            name: "Has errors",
            control: "boolean",
        },
    },
} as ComponentMeta<typeof FileDropzone>;

type Args = {
    disabled: boolean;
    multiple: boolean;
    hasError: boolean;
};

export const _FileDropzone = ({ disabled, multiple, hasError }: Args) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [rejectedFiles, setRejectedFiles] = React.useState<FileRejections>([]);

    return (
        <>
            <FileDropzone
                disabled={disabled}
                multiple={multiple}
                hasError={hasError}
                onDrop={(files) => {
                    setFiles(files);
                    setRejectedFiles([]);
                }}
                onDropRejected={(rejectedFiles) => {
                    setFiles([]);
                    setRejectedFiles(rejectedFiles);
                }}
            />
            <pre>{JSON.stringify({ files, rejectedFiles }, null, 2)}</pre>
        </>
    );
};

_FileDropzone.storyName = "FileDropzone";
