import { Field, FinalFormInput, FormSection } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Card, CardContent } from "@mui/material";
import { Form } from "react-final-form";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

export default {
    title: "@comet/admin-react-select",
};

export const FinalFormReactSelect = () => {
    return (
        <Card variant="outlined" style={{ width: 400 }}>
            <CardContent>
                <FormSection title="Final Form React Select" disableMarginBottom>
                    <Form
                        onSubmit={() => {
                            //
                        }}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="name" label="Name" type="text" component={FinalFormInput} fullWidth />
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
                </FormSection>
            </CardContent>
        </Card>
    );
};
