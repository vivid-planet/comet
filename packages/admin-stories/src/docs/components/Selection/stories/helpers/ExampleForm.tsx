import { Field, FinalForm, FinalFormInput } from "@comet/admin";
import * as React from "react";

import { User } from "./user.gql";

interface ExampleFormProps {
    user: User;
    mode: "add" | "edit";
}

export const ExampleForm = (props: ExampleFormProps) => {
    return (
        <FinalForm
            mode="edit"
            onSubmit={(values) => {
                // submit here
            }}
            initialValues={props.user}
        >
            <Field label="Name" name="name" defaultOptions required component={FinalFormInput} />
        </FinalForm>
    );
};
