import { gql, useApolloClient } from "@apollo/client";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { Field, FinalForm, FinalFormInput, FormSection, SaveButton } from "@comet/admin";
import { storiesOf } from "@storybook/react";
import * as React from "react";

export const updateUserMutation = gql`
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
        user: updateUser(id: $id, input: $input) {
            id
            firstname
            lastname
        }
    }
`;

const mocks: Array<MockedResponse> = [
    {
        request: {
            query: updateUserMutation,
            variables: {
                id: 1,
                input: {
                    firstname: "John",
                    lastname: "Doe",
                },
            },
        },
        result: {
            data: {
                user: {
                    id: 1,
                    firstname: "John",
                    lastname: "Doe",
                },
            },
        },
    },
];

interface InnerFormProps {
    id: number;
}

storiesOf("stories/form/Submit Mutation Best Practices", module).add("Submit Mutation Best Practices", () => {
    const InnerForm: React.VoidFunctionComponent<InnerFormProps> = ({ id }) => {
        const client = useApolloClient();

        return (
            <FinalForm
                mode="add"
                onSubmit={async (values) => {
                    // use client.mutate instead of useMutation() hook
                    const result = await client.mutate({
                        mutation: updateUserMutation,
                        variables: {
                            id,
                            input: {
                                firstname: values.firstname,
                                lastname: values.lastname,
                            },
                        },
                    });

                    window.alert(`Result: ${JSON.stringify(result)}`);
                }}
                initialValues={{
                    firstname: "",
                    lastname: "",
                }}
            >
                <FormSection>
                    <Field label="First name" name="firstname" placeholder="John" component={FinalFormInput} fullWidth />
                    <Field label="Last name" name="lastname" placeholder="Doe" component={FinalFormInput} fullWidth />
                </FormSection>
                <SaveButton type="submit" />
            </FinalForm>
        );
    };

    return (
        <MockedProvider mocks={mocks}>
            <InnerForm id={1} />
        </MockedProvider>
    );
});
