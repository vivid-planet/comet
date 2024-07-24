import { FileSelectItem, FileSelectListItem } from "@comet/admin";
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
    .add("FileSelectListItem", () => {
        const fileSize = 1.8 * 1024 * 1024; // 1.8 MB

        const fileItems: Record<string, FileSelectItem> = {
            "Valid File": { name: "Filename.xyz", size: fileSize },
            "Long File Name": {
                name: "This is a really long file name that should cause the text to be truncated and show a tooltip.png",
                size: fileSize,
            },
            Loading: { name: "Filename.xyz", loading: true },
            "Error (no details)": { name: "Filename.xyz", error: true },
            "Error (with details)": { name: "Filename.xyz", error: "File too large" },
            Skeleton: { loading: true },
        };

        const selectedFile = select("File Item", fileItems, fileItems["Valid File"]);
        const canBeDownloaded = boolean("Can Be Downloaded", true);
        const canBeDeleted = boolean("Can Be Deleted", true);
        const disabled = boolean("Disabled", false);

        return (
            <FileSelectListItem
                file={selectedFile}
                onClickDownload={canBeDownloaded ? () => alert("Download") : undefined}
                onClickDelete={canBeDeleted ? () => alert("Delete") : undefined}
                disabled={disabled}
            />
        );
    });
