import { MenuItem } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { Field, FieldContainerLabelAbove, FinalFormSelect } from "@vivid-planet/react-admin";
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
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="flavor" label="Flavor" fieldContainerComponent={FieldContainerLabelAbove}>
                            {(props) => (
                                <FinalFormSelect {...props}>
                                    {options.map((option) => (
                                        <MenuItem value={option.value} key={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </FinalFormSelect>
                            )}
                        </Field>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("react-admin-form", module).add("Select", () => <Story />);
