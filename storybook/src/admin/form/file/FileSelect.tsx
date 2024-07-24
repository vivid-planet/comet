import { FileSelect, FileSelectItem } from "@comet/admin";
import { Card, CardContent, Stack } from "@mui/material";
import { boolean, select } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import React from "react";

storiesOf("@comet/admin/form/File", module)
    .addDecorator((story) => (
        <Card sx={{ maxWidth: 440 }}>
            <CardContent>
                <Stack spacing={4}>{story()}</Stack>
            </CardContent>
        </Card>
    ))
    .add("FileSelect", () => {
        const exampleFiles: Record<string, FileSelectItem> = {
            "fileName.xyz": {
                name: "Filename.xyz",
                size: 4.3 * 1024 * 1024, // 4.3 MB
            },
            "anotherFile.png": {
                name: "Another file.png",
                size: 568 * 1024, // 568 KB
            },
            "fileNumberThree.jpg": {
                name: "File number three.jpg",
                size: 1.8 * 1024 * 1024, // 1.8 MB
            },
            "fileUploading.jpg": {
                name: "File that is uploading.jpg",
                loading: true,
            },
            "fileTooLarge.png": {
                name: "Failed to upload.png",
                size: 200 * 1024 * 1024, // 200 MB
                error: "The file is too large",
            },
        };

        const filesMapping = {
            "No files": [] as FileSelectItem[],
            "One valid file": [exampleFiles["fileName.xyz"]],
            "Three valid files": [exampleFiles["fileName.xyz"], exampleFiles["anotherFile.png"], exampleFiles["fileNumberThree.jpg"]],
            "Four files (one too large)": [
                exampleFiles["fileName.xyz"],
                exampleFiles["anotherFile.png"],
                exampleFiles["fileNumberThree.jpg"],
                exampleFiles["fileTooLarge.png"],
            ],
            "Four files (one uploading)": [
                exampleFiles["fileName.xyz"],
                exampleFiles["anotherFile.png"],
                exampleFiles["fileNumberThree.jpg"],
                exampleFiles["fileUploading.jpg"],
            ],
        };

        const disabled = boolean("Disabled", false);
        const multiple = boolean("Multiple", false);
        const hasError = boolean("Has Error", false);
        const hasMaxFileSize = boolean("Limit file size (5 MB)", false);
        const hasMaxFiles = boolean("Max number of files (4)", false);
        const onlyAllowImages = boolean("Only allow images", false);
        const filesSelection = select(
            "Existing files",
            ["No files", "One valid file", "Three valid files", "Four files (one too large)", "Four files (one uploading)"],
            "No files",
        );

        return (
            <FileSelect
                onDrop={(acceptedFiles, rejectedFiles) => {
                    console.log(acceptedFiles, rejectedFiles);
                }}
                onRemove={() => {
                    console.log("Removing file");
                }}
                onDownload={() => {
                    console.log("Downloading file");
                }}
                files={filesMapping[filesSelection]}
                disabled={disabled}
                multiple={multiple}
                maxFileSize={
                    hasMaxFileSize
                        ? 5 * 1024 * 1024 // 5 MB
                        : undefined
                }
                maxFiles={hasMaxFiles ? 4 : undefined}
                error={hasError ? "An error occurred" : undefined}
                accept={onlyAllowImages ? { "image/*": [] } : undefined}
            />
        );
    });
