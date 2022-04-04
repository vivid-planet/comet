import { CancelButton, Field, FinalFormCheckbox, FinalFormInput, FinalFormSelect, OkayButton } from "@comet/admin";
import { Save } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, FormControlLabel, MenuItem } from "@mui/material";
import { select } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

type DialogSize = Exclude<DialogProps["maxWidth"], false> | "fullWidth";

type DialogSizeOptions = {
    [label: string]: DialogSize;
};

const dialogSizeOptions: DialogSizeOptions = {
    "XS (350px)": "xs",
    "SM (600px)": "sm",
    "MD (1024px)": "md",
    "LG (1280px)": "lg",
    "XL (1920px)": "xl",
    FullWidth: "fullWidth",
};

const selectOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

function Story() {
    const selectedDialogSize = select("Dialog size", dialogSizeOptions, "sm");

    return (
        <div>
            <Form
                onSubmit={() => {}}
                initialValues={{
                    dialogSize: "sm",
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Dialog
                            scroll="body"
                            open={true}
                            fullWidth={selectedDialogSize === "fullWidth"}
                            maxWidth={selectedDialogSize !== "fullWidth" && selectedDialogSize}
                        >
                            <>{selectedDialogSize === "xs" ? <ConfirmationDialogContent /> : <DefaultDialogContent />}</>
                        </Dialog>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/mui", module).add("Dialog", () => <Story />);

function ConfirmationDialogContent(): React.ReactElement {
    return (
        <>
            <DialogTitle>This is a small confirmation dialog.</DialogTitle>
            <DialogActions>
                <CancelButton />
                <OkayButton />
            </DialogActions>
        </>
    );
}

function DefaultDialogContent(): React.ReactElement {
    return (
        <>
            <DialogTitle>Form in Dialog</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Lorem ipsum nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus
                    sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Curabitur blandit tempus porttitor.
                </DialogContentText>
                <Field name="text" label="Textfield" component={FinalFormInput} fullWidth />
                <Field name="select" label="Select" fullWidth>
                    {(props) => (
                        <FinalFormSelect {...props} fullWidth>
                            {selectOptions.map((option) => (
                                <MenuItem value={option.value} key={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </FinalFormSelect>
                    )}
                </Field>
                <Field name="checked" type="checkbox" fullWidth>
                    {(props) => <FormControlLabel label="Checkbox" control={<FinalFormCheckbox {...props} />} />}
                </Field>
            </DialogContent>
            <DialogActions>
                <CancelButton />
                <Button startIcon={<Save />} variant={"contained"} color="primary">
                    Save
                </Button>
            </DialogActions>
        </>
    );
}
