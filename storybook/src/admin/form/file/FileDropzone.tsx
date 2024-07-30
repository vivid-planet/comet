import { FileDropzone, FileDropzoneProps } from "@comet/admin";
import { Card, CardContent, Stack } from "@mui/material";
import { boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import React from "react";

type FileRejections = Parameters<Required<FileDropzoneProps>["onDropRejected"]>[0];

storiesOf("@comet/admin/form/File", module)
    .addDecorator((story) => (
        <Card sx={{ maxWidth: 440 }}>
            <CardContent>
                <Stack spacing={4}>{story()}</Stack>
            </CardContent>
        </Card>
    ))
    .add("FileDropzone", () => {
        const [files, setFiles] = React.useState<File[]>([]);
        const [rejectedFiles, setRejectedFiles] = React.useState<FileRejections>([]);

        return (
            <>
                <FileDropzone
                    disabled={boolean("Disabled", false)}
                    multiple={boolean("Multiple", false)}
                    hasError={boolean("Has Error", false)}
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
    });
