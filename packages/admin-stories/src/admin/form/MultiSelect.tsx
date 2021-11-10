import { Field, FinalFormMultiSelect } from "@comet/admin";
import { Box, Card, CardContent, FormLabel } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const colorOptions = [
        { value: "red", label: "Red", icon: <div style={{ width: 20, height: 20, backgroundColor: "red" }} /> },
        { value: "green", label: "Green", icon: <div style={{ width: 20, height: 20, backgroundColor: "green" }} /> },
        { value: "blue", label: "Blue", icon: <div style={{ width: 20, height: 20, backgroundColor: "blue" }} /> },
    ];

    return (
        <div>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box style={{ display: "flex", gap: "15px" }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <FormLabel>MultiSelect with ColorIcon</FormLabel>
                                    <Box width={200}>
                                        <Field name="multiSelectWithColorIcon" fullWidth component={FinalFormMultiSelect} options={colorOptions} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("MultiSelect", () => <Story />);
