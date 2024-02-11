import { Field, FinalFormRangeInput } from "@comet/admin";
import { Button } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

storiesOf("stories/components/Final Form Range Input/Default", module).add("Default", () => {
    return (
        <Form
            onSubmit={(values) => {
                // values
            }}
            render={({ handleSubmit, values, form, initialValues }) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Field component={FinalFormRangeInput} name="price" min={0} max={100} />
                    <div style={{ marginLeft: "40px", minHeight: "220px" }}>
                        <h3 style={{ marginTop: 0 }}>Value</h3>
                        <pre>{JSON.stringify(values, undefined, 2)}</pre>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                form.reset();
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            )}
        />
    );
});
