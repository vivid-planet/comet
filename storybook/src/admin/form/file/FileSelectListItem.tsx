import { FileSelectListItem } from "@comet/admin";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { boolean, text } from "@storybook/addon-knobs";
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
        const fileName = text("File Name", "Filename.xyz");
        const hasFileSize = boolean("Has File Size", true);
        const canBeDownloaded = boolean("Can Be Downloaded", true);
        const canBeDeleted = boolean("Can Be Deleted", true);

        const disabled = boolean("Disabled", false);
        const loading = boolean("Loading", false);
        const skeleton = boolean("Skeleton", false);

        const hasError = boolean("Has Error", false);
        const errorMessage = text("Error Message", "");
        const error = errorMessage ? errorMessage : hasError;

        return (
            <FileSelectListItem
                name={fileName}
                size={hasFileSize ? 1.8 * 1024 * 1024 : undefined}
                onClickDownload={canBeDownloaded ? () => alert("Download") : undefined}
                onClickDelete={canBeDeleted ? () => alert("Delete") : undefined}
                disabled={disabled}
                loading={loading}
                skeleton={skeleton}
                error={error}
            />
        );
    })
    .add("FileSelectListItem (multiple variants)", () => {
        return (
            <>
                <ExampleWrapper title="File item">
                    <FileSelectListItem
                        name="Filename.xyz"
                        size={1.8 * 1024 * 1024}
                        onClickDownload={() => alert("Download")}
                        onClickDelete={() => alert("Delete")}
                    />
                </ExampleWrapper>
                <ExampleWrapper title="Long file name">
                    <FileSelectListItem
                        name="This is a really long file name that should cause the text to be truncated and show a tooltip.png"
                        size={1.8 * 1024 * 1024}
                        onClickDownload={() => alert("Download")}
                        onClickDelete={() => alert("Delete")}
                    />
                </ExampleWrapper>
                <ExampleWrapper title="Loading">
                    <FileSelectListItem name="Filename.xyz" loading />
                </ExampleWrapper>
                <ExampleWrapper title="Error (no details)">
                    <FileSelectListItem name="Filename.xyz" error onClickDelete={() => alert("Delete")} />
                </ExampleWrapper>
                <ExampleWrapper title="Error (with details)">
                    <FileSelectListItem name="Filename.xyz" error="File too large" onClickDelete={() => alert("Delete")} />
                </ExampleWrapper>
                <ExampleWrapper title="Disabled">
                    <FileSelectListItem name="Filename.xyz" size={1.8 * 1024 * 1024} onClickDownload={() => alert("Download")} disabled />
                </ExampleWrapper>
                <ExampleWrapper title="Skeleton">
                    <FileSelectListItem skeleton />
                </ExampleWrapper>
            </>
        );
    });

type ExampleWrapperProps = React.PropsWithChildren<{
    title: string;
}>;

const ExampleWrapper = ({ children, title }: ExampleWrapperProps) => {
    return (
        <Box>
            <Typography gutterBottom variant="body2" fontWeight={700} mb={1}>
                {title}
            </Typography>
            {children}
        </Box>
    );
};
