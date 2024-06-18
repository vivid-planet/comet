import { FileSelectListItem } from "@comet/admin";
import { Card, CardContent } from "@mui/material";
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
                {/* Data (e.g. the name) for this file has not been loaded yet */}
                <FileSelectListItem skeleton />

                {/* All data is available and the file can be downloaded and deleted */}
                <FileSelectListItem
                    name="Filename.xyz"
                    size={4.3 * 1024 * 1024} // 4.3 MB
                    onClickDownload={() => {
                        // Handle download
                    }}
                    onClickDelete={() => {
                        // Handle delete
                    }}
                />

                {/* The file name is available but the remaining data is still loading or the file is currently being uploaded */}
                <FileSelectListItem name="File that is uploading.jpg" loading />

                {/* Something went wrong, it's not clear what */}
                <FileSelectListItem name="Unknown error.jpg" error />

                {/* A specific error ocurred, so the user can see an error message */}
                <FileSelectListItem
                    name="Upload failed.png"
                    size={200 * 1024 * 1024} // 200 MB
                    onClickDelete={() => {
                        // Handle delete
                    }}
                    error="File size too large"
                />
            </>
        );
    });
