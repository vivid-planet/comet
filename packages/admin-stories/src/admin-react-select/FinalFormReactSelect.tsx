import { Field, FinalFormInput, FormPaper } from "@comet/admin";
import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
import { Box, Button } from "@material-ui/core";
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
        <FormPaper variant="outlined" style={{ width: 300 }}>
            <Box marginBottom={4}>
                <Button component={"button"} disableTouchRipple>
                    blah
                </Button>
            </Box>

            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit, pristine, invalid }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="name" label="Name" type="text" component={FinalFormInput} fullWidth />
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
        </FormPaper>
    );
}

storiesOf("@comet/admin-react-select", module).add("Final Form React Select", () => <Story />);
