import { Field, FinalFormFileSelect } from "@comet/admin";
import { Card, CardContent, Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    return (
        <div style={{ width: 800 }}>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field fullWidth name="uploadDefault" label="File upload (default)" component={FinalFormFileSelect} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field
                                            name="uploadMultipleDisabled"
                                            label="File upload (dropzone only, multiple, max file size 5 MB), max 5 files"
                                            disableSelectFileButton
                                            component={FinalFormFileSelect}
                                            maxSize={5 * 1024 * 1024}
                                            multiple
                                            maxFiles={5}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field
                                            name="uploadImages"
                                            label="File upload (button only, accept only images)"
                                            accept={{ "image/*": [] }}
                                            disableDropzone
                                            component={FinalFormFileSelect}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field name="uploadDisabled" label="File upload (disabled)" disabled component={FinalFormFileSelect} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("FinalFormFileSelect", () => <Story />);
