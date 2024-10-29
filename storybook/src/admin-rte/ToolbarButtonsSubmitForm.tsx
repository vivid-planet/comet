import { Field } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import * as React from "react";
import { Form } from "react-final-form";

const { RteField } = createFinalFormRte();

export default {
    title: "@comet/admin-rte",
};

/**
 * Dev story to fix a bug where buttons in the RTE's toolbar trigger submission when used in a form.
 */
export const ToolbarButtonsSubmitForm = () => {
    return (
        <Form
            onSubmit={() => alert("submit")}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <Field name="text" component={RteField} />
                </form>
            )}
        />
    );
};

ToolbarButtonsSubmitForm.storyName = "Toolbar buttons submit form";
