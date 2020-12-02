import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { Field, FieldContainerLabelAbove, ReactSelectStaticOptions } from "@vivid-planet/react-admin-form";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];
    return (
        <div>
            <Dialog open={true}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <Form
                        onSubmit={(values) => {
                            //
                        }}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Field
                                    name="flavor"
                                    label="Flavor"
                                    fieldContainerComponent={FieldContainerLabelAbove}
                                    component={ReactSelectStaticOptions}
                                    isClearable
                                    defaultOptions
                                    options={options}
                                />
                            </form>
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="primary">Cancel</Button>
                    <Button color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

storiesOf("react-admin-form", module).add("React Select Dialog", () => <Story />);
