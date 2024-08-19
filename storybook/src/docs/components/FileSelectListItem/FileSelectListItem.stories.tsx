import { FileSelectListItem } from "@comet/admin";
import { Box, Card, CardContent } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/FileSelectListItem", module)
    .addDecorator((story) => (
        <Card>
            <CardContent>{story()}</CardContent>
        </Card>
    ))
    .add("FileSelectListItem", () => {
        return (
            <>
                {/* Data for this file has not been loaded yet */}
                <FileSelectListItem
                    file={{
                        loading: true,
                    }}
                />

                {/* All data is available and the file can be downloaded and deleted */}
                <FileSelectListItem
                    file={{
                        name: "Filename.xyz",
                        size: 4.3 * 1024 * 1024, // 4.3 MB
                    }}
                    onClickDownload={() => {
                        console.log("Downloading file");
                        // Handle download
                    }}
                    onClickDelete={() => {
                        console.log("Deleting file");
                        // Handle delete
                    }}
                />

                {/* The file name is available but the remaining data is still loading or the file is currently being uploaded */}
                <FileSelectListItem
                    file={{
                        name: "File that is uploading.jpg",
                        loading: true,
                    }}
                />

                {/* Something went wrong, it's not clear what */}
                <FileSelectListItem
                    file={{
                        name: "Filename.xyz",
                        error: true,
                    }}
                />

                {/* A specific error ocurred, so the user can see an error message */}
                <FileSelectListItem
                    file={{
                        name: "Filename.xyz",
                        size: 200 * 1024 * 1024, // 200 MB
                        error: "File too large",
                    }}
                    onClickDelete={() => {
                        console.log("Deleting file");
                        // Handle delete
                    }}
                />
            </>
        );
    })
    .add("Preview", () => {
        return (
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
                <FileSelectListItem
                    file={{
                        loading: true,
                    }}
                    filePreview
                />
                <FileSelectListItem
                    file={{
                        name: "Filename.zip",
                        size: 4.3 * 1024 * 1024, // 4.3 MB
                    }}
                    onClickDownload={() => {
                        // Handle download
                    }}
                    onClickDelete={() => {
                        // Handle delete
                    }}
                    filePreview
                />
                <FileSelectListItem
                    file={{
                        name: "Filename.jpg",
                        size: 4.3 * 1024 * 1024, // 4.3 MB
                    }}
                    onClickDownload={() => {
                        // Handle download
                    }}
                    onClickDelete={() => {
                        // Handle delete
                    }}
                    filePreview="https://picsum.photos/528/528"
                />
                <FileSelectListItem
                    file={{
                        name: "File that is uploading.jpg",
                        loading: true,
                    }}
                    filePreview
                />
                <FileSelectListItem
                    file={{
                        name: "Filename.xyz",
                        error: true,
                    }}
                    filePreview
                />
                <FileSelectListItem
                    file={{
                        name: "Filename.xyz",
                        size: 200 * 1024 * 1024, // 200 MB
                        error: "File too large",
                    }}
                    onClickDelete={() => {
                        // Handle delete
                    }}
                    filePreview
                />
            </Box>
        );
    });
