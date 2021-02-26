import { Field, FieldContainer, FinalFormRadio } from "@comet/admin-core";
import { FormControlLabel } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

function Story() {
    return (
        <div style={{ width: "300px" }}>
            <Form
                onSubmit={(values) => {
                    //
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
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

storiesOf("@comet/admin-core/form", module).add("Radio", () => <Story />);
