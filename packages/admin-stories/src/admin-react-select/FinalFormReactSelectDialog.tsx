import { Field } from "@comet/admin";
import { CancelButton, OkayButton } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

function Story() {
    return (
        <div>
            <Dialog open={true}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <Form
                        onSubmit={() => {
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
                                    fullWidth
                                />
                            </form>
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <CancelButton />
                    <OkayButton />
                </DialogActions>
            </Dialog>
        </div>
    );
}

storiesOf("@comet/admin-react-select", module).add("Final Form React Select Dialog", () => <Story />);
