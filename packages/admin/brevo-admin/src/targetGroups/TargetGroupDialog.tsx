import { useApolloClient } from "@apollo/client";
import { Field, FinalForm, FinalFormInput, type FinalFormSubmitEvent, useStackSwitchApi } from "@comet/admin";
import { type ContentScope } from "@comet/cms-admin";
import { type FormApi } from "final-form";
import { type ReactElement } from "react";
import { FormattedMessage } from "react-intl";

import { createTargetGroupMutation } from "./TargetGroupDialog.gql";
import { type GQLCreateTargetGroupMutation, type GQLCreateTargetGroupMutationVariables } from "./TargetGroupDialog.gql.generated";
import { type EditTargetGroupFinalFormValues } from "./TargetGroupForm";

interface TargetGroupDialogProps {
    scope: ContentScope;
}

export function TargetGroupDialog({ scope }: TargetGroupDialogProps): ReactElement {
    const client = useApolloClient();
    const mode = "add";
    const stackSwitchApi = useStackSwitchApi();

    const handleSubmit = async (
        state: EditTargetGroupFinalFormValues,
        form: FormApi<EditTargetGroupFinalFormValues>,
        event: FinalFormSubmitEvent,
    ) => {
        const output = {
            ...state,
        };

        const { data: mutationResponse } = await client.mutate<GQLCreateTargetGroupMutation, GQLCreateTargetGroupMutationVariables>({
            mutation: createTargetGroupMutation,
            variables: { scope, input: output },
        });
        if (!event.navigatingBack) {
            const id = mutationResponse?.createBrevoTargetGroup.id;
            if (id) {
                setTimeout(() => {
                    stackSwitchApi.activatePage("edit", id);
                });
            }
        }
    };
    return (
        <FinalForm<EditTargetGroupFinalFormValues> onSubmit={handleSubmit} mode={mode}>
            {() => {
                return (
                    <Field
                        required
                        fullWidth
                        name="title"
                        component={FinalFormInput}
                        label={<FormattedMessage id="cometBrevoModule.targetGroup.title" defaultMessage="Title" />}
                    />
                );
            }}
        </FinalForm>
    );
}
