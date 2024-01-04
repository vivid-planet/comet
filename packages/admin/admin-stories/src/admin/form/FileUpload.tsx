import { Field, FinalFormFileUpload } from "@comet/admin";
import { Card, CardContent, Grid } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";
import { FormattedMessage } from "react-intl";

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
                                        <Field name="uploadDefault" label="File upload (default)" component={FinalFormFileUpload} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field
                                            name="uploadMultipleDisabled"
                                            label="File upload (dropzone only, multiple disabled)"
                                            dropzoneVariant="dropzoneOnly"
                                            component={FinalFormFileUpload}
                                            multipleFiles={false}
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
                                            maxSize={10}
                                            dropzoneVariant="buttonOnly"
                                            component={FinalFormFileUpload}
                                            caption={
                                                <FormattedMessage
                                                    id="comet.finalformfileupload.maximumfilesize"
                                                    defaultMessage="Maximum file size 10 MB"
                                                />
                                            }
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field name="uploadDisabled" label="File upload (disabled)" disabled component={FinalFormFileUpload} />
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

storiesOf("@comet/admin/form", module).add("FileUpload", () => <Story />);
