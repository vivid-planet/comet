import { storiesOf } from "@storybook/react";
import { Field, FieldContainerLabelAbove, Input, ReactSelectStaticOptions } from "@vivid-planet/react-admin-form";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry", isDisabled: true },
        { value: "vanilla", label: "Vanilla" },
        { value: "cherry", label: "Cherry" },
    ];
    return (
        <div style={{ width: "300px" }}>
            <Form
                onSubmit={values => {
                    //
                }}
                render={({ handleSubmit, pristine, invalid }) => (
                    <form onSubmit={handleSubmit}>
                        <Field
                            name="flavor"
                            label="Flavor"
                            fieldContainerComponent={FieldContainerLabelAbove}
                            component={ReactSelectStaticOptions}
                            placeholder=""
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
