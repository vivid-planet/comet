import { Field, FinalFormCheckbox } from "@comet/admin";
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
                        <Field name="name" label="Foo" type="checkbox" component={FinalFormCheckbox} />
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin/form", module).add("Checkbox", () => <Story />);
