import { CancelButton, Field, OkayButton } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form } from "react-final-form";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

export default {
    title: "@comet/admin-react-select",
};

export const FinalFormReactSelectDialog = () => {
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
};
