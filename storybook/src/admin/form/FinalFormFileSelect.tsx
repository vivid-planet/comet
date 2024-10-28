import { Field, FinalFormFileSelect } from "@comet/admin";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import * as React from "react";
import { Form } from "react-final-form";

type FormValues = {
    singleFile: File;
    multipleFiles: File[];
    multipleImages: File[];
    disabled: File[];
};

function Story() {
    return (
        <Box maxWidth={1600}>
            <Form<FormValues>
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field name="singleFile" label="Single file select" component={FinalFormFileSelect} fullWidth />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field
                                            name="multipleFiles"
                                            label="Multi file select (max file size 5 MB)"
                                            component={FinalFormFileSelect}
                                            maxSize={5 * 1024 * 1024} // 5 MB
                                            multiple
                                            fullWidth
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field
                                            name="fiveImages"
                                            label="Select up to 5 images"
                                            component={FinalFormFileSelect}
                                            accept={{ "image/*": [] }}
                                            maxFiles={5}
                                            fullWidth
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field name="disabled" label="Disabled file select" component={FinalFormFileSelect} disabled fullWidth />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h4" sx={{ mb: 4 }}>
                                            Vertical form layout
                                        </Typography>
                                        <Field
                                            name="vertical"
                                            label="File Select"
                                            component={FinalFormFileSelect}
                                            multiple
                                            fullWidth
                                            helperText="Selected files will also be shown in the read-only field below."
                                        />
                                        <Field
                                            name="vertical"
                                            label="File Select - ReadOnly Grid"
                                            component={FinalFormFileSelect}
                                            layout="grid"
                                            readOnly
                                            multiple
                                            fullWidth
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h4" sx={{ mb: 4 }}>
                                            Horizontal form layout
                                        </Typography>
                                        <Field
                                            name="horizontal"
                                            label="File Select"
                                            component={FinalFormFileSelect}
                                            multiple
                                            fullWidth
                                            variant="horizontal"
                                            helperText="Selected files will also be shown in the read-only field below."
                                        />
                                        <Field
                                            variant="horizontal"
                                            name="horizontal"
                                            label="File Select - ReadOnly Grid"
                                            component={FinalFormFileSelect}
                                            layout="grid"
                                            readOnly
                                            multiple
                                            fullWidth
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <pre>{JSON.stringify(values, null, 2)}</pre>
                    </form>
                )}
            />
        </Box>
    );
}

export default {
    title: "@comet/admin/form",
};

export const _FinalFormFileSelect = () => <Story />;

_FinalFormFileSelect.storyName = "FinalFormFileSelect";
