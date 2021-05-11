import { Field, FinalFormCheckbox, FinalFormInput, FinalFormSelect } from "@comet/admin";
import { Clear, Save } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, MenuItem } from "@material-ui/core";
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
                <DialogTitle>Form in Dialog</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Lorem ipsum nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.
                        Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Curabitur blandit tempus porttitor.
                    </DialogContentText>
                    <Form
                        onSubmit={(values) => {
                            //
                        }}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="text" label="Textfield" component={FinalFormInput} fullWidth />
                                <Field name="select" label="Select">
                                    {(props) => (
                                        <FinalFormSelect {...props} fullWidth>
                                            {options.map((option) => (
                                                <MenuItem value={option.value} key={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </FinalFormSelect>
                                    )}
                                </Field>
                                <Field name="checked" type="checkbox">
                                    {(props) => <FormControlLabel label="Checkbox" control={<FinalFormCheckbox {...props} />} />}
                                </Field>
                            </form>
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<Clear />}>Cancel</Button>
                    <Button startIcon={<Save />} variant={"contained"} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

storiesOf("@comet/admin/mui", module).add("Dialog", () => <Story />);
