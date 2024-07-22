import { Field, FinalFormFileSelect } from "@comet/admin";
import { Card, CardContent, Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
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
        <div style={{ width: 800 }}>
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
                                        <Field
                                            name="singleFile"
                                            label="File select (default)"
                                            component={FinalFormFileSelect}
                                            maxFiles={1}
                                            fullWidth
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field
                                            name="multipleFiles"
                                            label="File select (dropzone only, multiple, max file size 5 MB), max 5 files"
                                            component={FinalFormFileSelect}
                                            maxSize={50 * 1024 * 1024}
                                            maxFiles={5}
                                            fullWidth
                                            slotProps={{
                                                dropzone: {
                                                    hideButton: true,
                                                },
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field
                                            name="multipleImages"
                                            label="File select (button only, accept only images)"
                                            component={FinalFormFileSelect}
                                            accept={{ "image/*": [] }}
                                            fullWidth
                                            slotProps={{
                                                dropzone: {
                                                    hideDroppableArea: true,
                                                },
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field name="disabled" label="File select (disabled)" component={FinalFormFileSelect} disabled fullWidth />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <pre>{JSON.stringify(values, null, 2)}</pre>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("FinalFormFileSelect", () => <Story />);
