import { FileDropzone } from "@comet/admin";
import { Card, CardContent, Stack } from "@mui/material";
import { Meta } from "@storybook/react";
import * as React from "react";

export default {
    title: "stories/components/FileDropzone",

    decorators: [
        (story) => (
            <Card>
                <CardContent>
                    <Stack gap={4} direction="row">
                        {story()}
                    </Stack>
                </CardContent>
            </Card>
        ),
    ],
} as Meta<typeof FileDropzone>;

export const Default = () => {
    return (
        <FileDropzone
            onDrop={(acceptedFiles, fileRejections) => {
                // Handle what happens with the dropped files
            }}
        />
    );
};

export const DisabledAndErrorStates = {
    render: () => {
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
    },

    name: "Disabled and error states",
};
