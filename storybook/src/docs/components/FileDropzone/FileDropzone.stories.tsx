import { FileDropzone } from "@comet/admin";
import { Card, CardContent, Stack } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

storiesOf("stories/components/FileDropzone", module)
    .addDecorator((story) => (
        <Card>
            <CardContent>
                <Stack gap={4} direction="row">
                    {story()}
                </Stack>
            </CardContent>
        </Card>
    ))
    .add("Default", () => {
        return (
            <FileDropzone
                onDrop={(acceptedFiles, fileRejections) => {
                    // Handle what happens with the dropped files
                }}
            />
        );
    })
    .add("Disabled and error states", () => {
        return (
            <>
                <FileDropzone
                    disabled
                    onDrop={(acceptedFiles, fileRejections) => {
                        // Handle what happens with the dropped files
                    }}
                />
                <FileDropzone
                    hasError
                    onDrop={(acceptedFiles, fileRejections) => {
                        // Handle what happens with the dropped files
                    }}
                />
            </>
        );
    });
