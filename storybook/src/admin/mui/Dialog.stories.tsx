import { CancelButton, Dialog, Field, FinalFormCheckbox, FinalFormInput, FinalFormSelect, OkayButton } from "@comet/admin";
import { Save } from "@comet/admin-icons";
import { Button, DialogActions, DialogContent, DialogContentText, DialogProps, FormControlLabel, MenuItem } from "@mui/material";
import { Form } from "react-final-form";

type DialogSize = Exclude<DialogProps["maxWidth"], false> | "fullWidth" | "fullScreen";

type DialogSizeOptions = {
    [label: string]: DialogSize;
};

const dialogSizeOptions: DialogSizeOptions = {
    "XS (350px)": "xs",
    "SM (680px)": "sm",
    "MD (1024px)": "md",
    "LG (1280px)": "lg",
    "XL (1920px)": "xl",
    FullWidth: "fullWidth",
    FullScreen: "fullScreen",
};

const selectOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

export default {
    title: "@comet/admin/mui",
    args: {
        selectedDialogSize: "sm",
        selectedDialogTitle: "Dialog Title Example",
        selectedDialogOnClose: null,
    },
    argTypes: {
        selectedDialogSize: {
            name: "Dialog Size",
            control: "select",
            options: dialogSizeOptions,
        },
        selectedDialogTitle: {
            name: "Dialog Title",
            control: "select",
            options: {
                "Dialog Title Example": "Dialog Title Example",
                None: "",
            },
        },
        selectedDialogOnClose: {
            name: "Dialog onClose",
            control: "select",
            options: {
                "No callback": null,
                "Provided callback": "callback",
            },
        },
    },
};

type Args = {
    selectedDialogSize: DialogSize;
    selectedDialogTitle: string;
    selectedDialogOnClose: string;
};

export const _Dialog = {
    render: ({ selectedDialogSize, selectedDialogTitle, selectedDialogOnClose }: Args) => {
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
                                title={selectedDialogTitle}
                                onClose={selectedDialogOnClose === "callback" ? () => console.log("Dialog closed") : undefined}
                                open={true}
                                fullWidth={selectedDialogSize === "fullWidth"}
                                fullScreen={selectedDialogSize === "fullScreen"}
                                maxWidth={selectedDialogSize !== "fullWidth" && selectedDialogSize !== "fullScreen" && selectedDialogSize}
                            >
                                <>{selectedDialogSize === "xs" ? <ConfirmationDialogContent /> : <DefaultDialogContent />}</>
                            </Dialog>
                        </form>
                    )}
                />
            </div>
        );
    },
};

function ConfirmationDialogContent() {
    return (
        <DialogActions>
            <CancelButton />
            <OkayButton />
        </DialogActions>
    );
}

function DefaultDialogContent() {
    return (
        <>
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
                <Button startIcon={<Save />} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </>
    );
}
