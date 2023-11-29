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
                                        <Field name="upload" label="File upload (default)" value="bar1" component={FinalFormFileUpload} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field
                                            name="upload"
                                            label="File upload (dropzone only)"
                                            dropzoneVariant="dropzoneOnly"
                                            value="bar1"
                                            component={FinalFormFileUpload}
                                            caption={
                                                <FormattedMessage
                                                    id="comet.finalformfileupload.maximumfilesize"
                                                    defaultMessage="Maximum file size 50 MB"
                                                />
                                            }
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field
                                            name="upload"
                                            label="File upload (button only)"
                                            dropzoneVariant="buttonOnly"
                                            value="bar1"
                                            component={FinalFormFileUpload}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Field name="upload" label="File upload (disabled)" disabled value="bar1" component={FinalFormFileUpload} />
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
