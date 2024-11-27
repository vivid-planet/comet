import { useApolloClient, useQuery } from "@apollo/client";
import { filterByFragment, FinalForm, FinalFormSubmitEvent, Loading, TextField, useFormApiRef, useStackSwitchApi } from "@comet/admin";
import { queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
import { FormApi } from "final-form";
import isEqual from "lodash.isequal";
import React from "react";
import { FormattedMessage } from "react-intl";

import { createFormBuilderMutation, formBuilderFormFragment, formBuilderQuery, updateFormBuilderMutation } from "./generated/FormBuilderAddForm.gql";
import {
    GQLCreateFormBuilderMutation,
    GQLCreateFormBuilderMutationVariables,
    GQLFormBuilderAddFormFragment,
    GQLFormBuilderQuery,
    GQLFormBuilderQueryVariables,
    GQLUpdateFormBuilderMutation,
    GQLUpdateFormBuilderMutationVariables,
} from "./generated/FormBuilderAddForm.gql.generated";

type FormValues = GQLFormBuilderAddFormFragment;

interface FormProps {
    id?: string;
}

export function FormBuilderAddForm({ id }: FormProps): React.ReactElement {
    const client = useApolloClient();
    const mode = id ? "edit" : "add";
    const formApiRef = useFormApiRef<FormValues>();
    const stackSwitchApi = useStackSwitchApi();

    const { data, error, loading, refetch } = useQuery<GQLFormBuilderQuery, GQLFormBuilderQueryVariables>(
        formBuilderQuery,
        id ? { variables: { id } } : { skip: true },
    );

    const initialValues = React.useMemo<Partial<FormValues>>(
        () =>
            data?.formBuilder
                ? {
                      ...filterByFragment<GQLFormBuilderAddFormFragment>(formBuilderFormFragment, data.formBuilder),
                  }
                : {},
        [data],
    );

    const saveConflict = useFormSaveConflict({
        checkConflict: async () => {
            const updatedAt = await queryUpdatedAt(client, "formBuilder", id);
            return resolveHasSaveConflict(data?.formBuilder.updatedAt, updatedAt);
        },
        formApiRef,
        loadLatestVersion: async () => {
            await refetch();
        },
    });

    const handleSubmit = async (formValues: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
        if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");
        const output = {
            ...formValues,
        };
        if (mode === "edit") {
            if (!id) throw new Error();
            const { ...updateInput } = output;
            await client.mutate<GQLUpdateFormBuilderMutation, GQLUpdateFormBuilderMutationVariables>({
                mutation: updateFormBuilderMutation,
                variables: { id, input: updateInput },
            });
        } else {
            const { data: mutationResponse } = await client.mutate<GQLCreateFormBuilderMutation, GQLCreateFormBuilderMutationVariables>({
                mutation: createFormBuilderMutation,
                variables: { input: { ...output, blocks: { blocks: [] } } },
            });
            if (!event.navigatingBack) {
                const id = mutationResponse?.createFormBuilder.id;
                if (id) {
                    setTimeout(() => {
                        stackSwitchApi.activatePage(`edit`, id);
                    });
                }
            }
        }
    };

    if (error) throw error;

    if (loading) {
        return <Loading behavior="fillPageHeight" />;
    }

    return (
        <FinalForm<FormValues>
            apiRef={formApiRef}
            onSubmit={handleSubmit}
            mode={mode}
            initialValues={initialValues}
            initialValuesEqual={isEqual} //required to compare block data correctly
            subscription={{}}
        >
            {() => (
                <>
                    {saveConflict.dialogs}
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
                            label={<FormattedMessage id="formBuilder.submitButtonText" defaultMessage="Absenden-Button Text" />}
                        />
                    </>
                </>
            )}
        </FinalForm>
    );
}
