import { Field, FinalFormCheckbox, FinalFormInput, FinalFormSelect } from "@comet/admin";
import { Clear, Save } from "@comet/admin-icons";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogProps,
    DialogTitle,
    FormControlLabel,
    MenuItem,
} from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

type DialogSize = DialogProps["maxWidth"] | "fullWidth";

interface DialogSizeOption {
    value: DialogSize;
    label: string;
}

const dialogSizeOptions: DialogSizeOption[] = [
    { value: "xs", label: "XS (350px)" },
    { value: "sm", label: "SM (600px)" },
    { value: "md", label: "MD (1024px)" },
    { value: "lg", label: "LG (1280px)" },
    { value: "xl", label: "XL (1920px)" },
    { value: "fullWidth", label: "FullWidth" },
];

function Story() {
    return (
        <div>
            <Form
                onSubmit={(values) => {
                    //
                }}
                initialValues={{
                    dialogSize: "sm",
                }}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Dialog
                            scroll="body"
                            open={true}
                            fullWidth={values.dialogSize === "fullWidth"}
                            maxWidth={values.dialogSize !== "fullWidth" && values.dialogSize}
                        >
                            <DialogTitle>Form in Dialog</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Lorem ipsum nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id
                                    elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Curabitur blandit tempus porttitor.
                                </DialogContentText>
                                <Field name="dialogSize" label="Choose dialog size">
                                    {(props) => (
                                        <FinalFormSelect {...props} fullWidth>
                                            {dialogSizeOptions.map((option) => (
                                                <MenuItem value={option.value} key={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </FinalFormSelect>
                                    )}
                                </Field>
                                <Field name="text" label="Textfield" component={FinalFormInput} fullWidth />
                                <Field name="checked" type="checkbox">
                                    {(props) => <FormControlLabel label="Checkbox" control={<FinalFormCheckbox {...props} />} />}
                                </Field>
                            </DialogContent>
                            <DialogActions>
                                <Button startIcon={<Clear />}>Cancel</Button>
                                <Button startIcon={<Save />} variant={"contained"} color="primary">
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/mui", module).add("Dialog", () => <Story />);
