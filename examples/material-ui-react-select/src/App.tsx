import { Button, ListItem } from "@material-ui/core";
import { Field, FieldContainerLabelAbove, Input, ReactSelectStaticOptions } from "@vivid-planet/react-admin-form";
import * as React from "react";
import { Form } from "react-final-form";

export default function App() {
    const options = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];
    return (
        <div style={{ width: "300px" }}>
            <ListItem>
                <Button component={"button"} disableTouchRipple>
                    blah
                </Button>
            </ListItem>

            <Form
                onSubmit={values => {
                    //
                }}
                render={({ handleSubmit, pristine, invalid }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="name" label="Name" type="text" fieldContainerComponent={FieldContainerLabelAbove} component={Input} fullWidth />
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
    // return <ReactSelectStaticOptions options={options} />;
}
