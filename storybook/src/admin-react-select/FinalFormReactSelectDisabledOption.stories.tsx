import { Field, FormSection } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Card, CardContent } from "@mui/material";
import { Form } from "react-final-form";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry", isDisabled: true },
    { value: "vanilla", label: "Vanilla" },
    { value: "cherry", label: "Cherry" },
];

export default {
    title: "@comet/admin-react-select",
};

export const FinalFormReactSelectDisabledOption = () => {
    return (
        <Card variant="outlined" style={{ width: 400 }}>
            <CardContent>
                <FormSection title="Final Form React Select Disabled Option" disableMarginBottom>
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
                                    placeholder=""
                                    isClearable
                                    defaultOptions
                                    options={options}
                                    fullWidth
                                />
                            </form>
                        )}
                    />
                </FormSection>
            </CardContent>
        </Card>
    );
};
