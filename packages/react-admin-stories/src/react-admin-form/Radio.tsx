import { FormControlLabel } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { Field, FieldContainer, FinalFormInput, FinalFormRadio } from "@vivid-planet/react-admin";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    return (
        <div style={{ width: "300px" }}>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit, pristine, invalid }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="name" label="Name" type="text" component={FinalFormInput} fullWidth />
                        <FieldContainer label="Foo">
                            <Field name="foo" type="radio" value="foo1">
                                {(props) => <FormControlLabel label="Foo1" control={<FinalFormRadio {...props} />} />}
                            </Field>
                            <Field name="foo" type="radio" value="foo2">
                                {(props) => <FormControlLabel label="Foo2" control={<FinalFormRadio {...props} />} />}
                            </Field>
                        </FieldContainer>
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("react-admin-form", module).add("Radio", () => <Story />);
