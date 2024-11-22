import { Field } from "@comet/admin";
import { createFinalFormRte } from "@comet/admin-rte";
import * as React from "react";
import { Form } from "react-final-form";

const { RteField } = createFinalFormRte();

export default {
    title: "@comet/admin-rte",
};

export const ToolbarButtonsSubmitForm = {
    render: () => {
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
    },

    name: "Toolbar buttons submit form",
};
