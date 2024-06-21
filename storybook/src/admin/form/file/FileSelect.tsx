import { FileSelect, FileSelectItem } from "@comet/admin";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import React from "react";

type StoryProps = {
    hasExistingFiles?: boolean;
};

const dummyFiles: FileSelectItem[] = [
    { name: "lorem ipsum.png", size: 3e5 },
    {
        name: "This is a file with a really long name to test truncating in the file list.jpeg",
        size: 6e6,
    },
    {
        name: "failed.png",
        error: true,
    },
];

const dummyFileDownload = (file: any) => {
    alert(`Pretend "${file.name}" was just downloaded.`);
};

const SingleFileSelectStory = ({ hasExistingFiles }: StoryProps) => {
    const [file, setFile] = React.useState<FileSelectItem | undefined>(hasExistingFiles ? dummyFiles[0] : undefined);
    const [tooManyFilesSelected, setTooManyFilesSelected] = React.useState(false);

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Single File Select
                </Typography>
                <FileSelect
                    onDrop={(acceptedFiles, rejectedFiles) => {
                        const tooManyFilesWereDropped = rejectedFiles.some((rejection) =>
                            rejection.errors.some((error) => error.code === "too-many-files"),
                        );

                        setTooManyFilesSelected(tooManyFilesWereDropped);

                        if (!tooManyFilesWereDropped) {
                            if (acceptedFiles.length > 0) {
                                setFile({
                                    name: acceptedFiles[0].name,
                                    size: acceptedFiles[0].size,
                                });
                            }
                            if (rejectedFiles.length > 0) {
                                setFile({
                                    name: rejectedFiles[0].file.name,
                                    error: true,
                                });
                            }
                        }
                    }}
                    onRemove={() => {
                        setFile(undefined);
                    }}
                    onDownload={dummyFileDownload}
                    maxFiles={1}
                    maxFileSize={1024 * 1024 * 5} // 5 MB
                    files={file ? [file] : []}
                    error={tooManyFilesSelected ? "Selection was canceled. You can only select one file." : undefined}
                />
            </CardContent>
        </Card>
    );
};

const MultipleFileSelectStory = ({ hasExistingFiles }: StoryProps) => {
    const [files, setFiles] = React.useState<FileSelectItem[]>(hasExistingFiles ? dummyFiles : []);
    const [tooManyFilesSelected, setTooManyFilesSelected] = React.useState(false);
    const maxNumberOfFiles = 4;

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Multiple File Select
                </Typography>
                <FileSelect
                    onDrop={(acceptedFiles, rejectedFiles) => {
                        const tooManyFilesWereDropped = rejectedFiles.some((rejection) =>
                            rejection.errors.some((error) => error.code === "too-many-files"),
                        );

                        setTooManyFilesSelected(tooManyFilesWereDropped);

                        if (!tooManyFilesWereDropped) {
                            setFiles((existingFiles) => {
                                return [
                                    ...existingFiles,
                                    ...acceptedFiles.map((file) => ({
                                        name: file.name,
                                        size: file.size,
                                    })),
                                    ...rejectedFiles.map((file) => ({
                                        name: file.file.name,
                                        error: true,
                                    })),
                                ];
                            });
                        }
                    }}
                    onRemove={(fileToRemove) => setFiles(files.filter((file) => file.name !== fileToRemove.name))}
                    onDownload={dummyFileDownload}
                    files={files}
                    maxFiles={maxNumberOfFiles}
                    maxFileSize={1024 * 1024 * 5} // 5 MB
                    error={
                        tooManyFilesSelected
                            ? `Selection was canceled. You can only select a maximum of ${maxNumberOfFiles} files, please reduce your selection.`
                            : undefined
                    }
                />
            </CardContent>
        </Card>
    );
};

storiesOf("@comet/admin/form/File", module).add("File Select", () => {
    return (
        <div>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <SingleFileSelectStory />
                </Grid>
                <Grid item xs={6}>
                    <MultipleFileSelectStory />
                </Grid>
                <Grid item xs={6}>
                    <SingleFileSelectStory hasExistingFiles />
                </Grid>
                <Grid item xs={6}>
                    <MultipleFileSelectStory hasExistingFiles />
                </Grid>
            </Grid>
        </div>
    );
});
