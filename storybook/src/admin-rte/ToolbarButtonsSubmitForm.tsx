import { Field } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form } from "react-final-form";

const { RteField } = createFinalFormRte();

/**
 * Dev story to fix a bug where buttons in the RTE's toolbar trigger submission when used in a form.
 */
function Story() {
    return (
        <>
            <Form
                onSubmit={() => alert("submit")}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Field name="text" component={RteField} />
                    </form>
                )}
            />
        </>
    );
}

storiesOf("@comet/admin-rte", module).add("Toolbar buttons submit form", () => <Story />);
