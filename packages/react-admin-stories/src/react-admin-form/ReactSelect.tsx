import { Button, ListItem, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { Field, FieldContainerLabelAbove, FinalFormInput } from "@vivid-planet/react-admin";
import { FinalFormReactSelectStaticOptions } from "@vivid-planet/react-admin-react-select";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];
    return (
        <div style={{ width: "300px" }}>
            <ListItem>
                <Button component={"button"} disableTouchRipple>
                    <Typography variant="button">blah</Typography>
                </Button>
            </ListItem>

            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit, pristine, invalid }) => (
                    <form onSubmit={handleSubmit}>
                        <Field
                            name="name"
                            label="Name"
                            type="text"
                            fieldContainerComponent={FieldContainerLabelAbove}
                            component={FinalFormInput}
                            fullWidth
                        />
                        <Field
                            name="flavor"
                            label="Flavor"
                            fieldContainerComponent={FieldContainerLabelAbove}
                            component={FinalFormReactSelectStaticOptions}
                            isClearable
                            defaultOptions
                            options={options}
                        />
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("react-admin-form", module).add("React Select", () => <Story />);
