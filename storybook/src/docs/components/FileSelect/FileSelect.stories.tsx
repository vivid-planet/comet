import { FileSelect, FileSelectItem } from "@comet/admin";
import { Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/FileSelect", module)
    .addDecorator((story) => (
        <Card>
            <CardContent>{story()}</CardContent>
        </Card>
    ))
    .add("FileSelect", () => {
        const value: FileSelectItem[] = [
            {
                name: "Filename.xyz",
                size: 4.3 * 1024 * 1024, // 4.3 MB
            },
            {
                name: "Another file.png",
                size: 568 * 1024, // 568 KB
            },
            {
                name: "File that is uploading.jpg",
                loading: true,
            },
            {
                name: "Failed to upload.png",
                size: 200 * 1024 * 1024, // 200 MB
                error: "The file is too large",
            },
        ];

        return (
            <FileSelect
                onDrop={(acceptedFiles, fileRejections) => {
                    // Handle what happens with the dropped files
                }}
                onRemove={(file) => {
                    // Handle remove
                }}
                onDownload={(file) => {
                    // Handle download
                }}
                files={value}
                maxFileSize={10 * 1024 * 1024} // 10 MB
                maxFiles={5}
            />
        );
    });
