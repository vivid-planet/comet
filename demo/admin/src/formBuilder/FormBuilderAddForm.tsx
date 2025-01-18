// TODO: Remove this file once the generator can handle this (FormBuilderAddForm.cometGen.ts)

import { useApolloClient } from "@apollo/client";
import { FinalForm, FinalFormSubmitEvent, TextField, useFormApiRef, useStackSwitchApi } from "@comet/admin";
import { GQLFormBuilderContentScopeInput } from "@src/graphql.generated";
import { FormApi } from "final-form";
import React from "react";
import { FormattedMessage } from "react-intl";

import { createFormBuilderMutation } from "./FormBuilderAddForm.gql";
import {
    GQLCreateFormBuilderMutation,
    GQLCreateFormBuilderMutationVariables,
    GQLFormBuilderAddFormFragment,
} from "./FormBuilderAddForm.gql.generated";

type FormValues = GQLFormBuilderAddFormFragment;

interface FormProps {
    scope: GQLFormBuilderContentScopeInput;
}

export function FormBuilderAddForm({ scope }: FormProps): React.ReactElement {
    const client = useApolloClient();

    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();

    const initialValues = {};

    const handleSubmit = async (formValues: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
        const output = {
            ...formValues,
            blocks: { blocks: [] }, // This was added manually as the generator can't do this yet.
        };

        const { data: mutationResponse } = await client.mutate<GQLCreateFormBuilderMutation, GQLCreateFormBuilderMutationVariables>({
            mutation: createFormBuilderMutation,
            variables: { input: output, scope },
        });
        if (!event.navigatingBack) {
            const id = mutationResponse?.createFormBuilder.id;
            if (id) {
                setTimeout(() => {
                    stackSwitchApi.activatePage(`edit`, id);
                });
            }
        }
    };

    return (
        <FinalForm<FormValues> apiRef={formApiRef} onSubmit={handleSubmit} mode="add" initialValues={initialValues} subscription={{}}>
            {() => (
                <>
                    <TextField
                        required
                        variant="horizontal"
                        fullWidth
                        name="name"
                        label={<FormattedMessage id="formBuilder.name" defaultMessage="Name" />}
                    />

                    <TextField
                        variant="horizontal"
                        fullWidth
                        name="submitButtonText"
                        label={<FormattedMessage id="formBuilder.submitButtonText" defaultMessage="Submit button text" />}
                    />
                </>
            )}
        </FinalForm>
    );
}
