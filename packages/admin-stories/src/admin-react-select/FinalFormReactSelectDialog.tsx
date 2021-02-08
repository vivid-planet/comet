import { Field } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
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
                                    component={FinalFormReactSelectStaticOptions}
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

storiesOf("@comet/admin-react-select", module).add("Final Form React Select Dialog", () => <Story />);
