import { Field, FinalFormSwitch } from "@comet/admin-core";
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
                        <Field name="name" label="Foo" component={FinalFormSwitch} />
                    </form>
                )}
            />
        </div>
    );
}

storiesOf("@comet/admin-core/form", module).add("Switch", () => <Story />);
