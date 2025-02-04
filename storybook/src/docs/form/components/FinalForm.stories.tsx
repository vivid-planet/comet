import { gql, useApolloClient } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { Field, FinalForm, FinalFormInput, FormSection, SaveButton } from "@comet/admin";
import { useFormApiRef } from "@comet/admin/lib/FinalForm";
import { type VoidFunctionComponent } from "react";

export default {
    title: "Docs/Form/Components/FinalForm",
};

export const BasicFinalForm = {
    render: () => {
        return (
            <FinalForm
                mode="add"
                onSubmit={(values) => {
                    window.alert(JSON.stringify(values));
                }}
            >
                <FormSection>
                    <Field label="First name" name="firstname" placeholder="John" component={FinalFormInput} fullWidth />
                    <Field label="Last name" name="lastname" placeholder="Doe" component={FinalFormInput} fullWidth />
                </FormSection>
                <SaveButton type="submit" />
            </FinalForm>
        );
    },

    name: "Basic FinalForm",
};

export const FinalFormApiRef = {
    render: () => {
        const apiRef = useFormApiRef();
        return (
            <div>
                <FinalForm
                    apiRef={apiRef}
                    mode="add"
                    onSubmit={(values) => {
                        window.alert(JSON.stringify(values));
                    }}
                >
                    <FormSection>
                        <Field label="First name" name="firstname" placeholder="John" component={FinalFormInput} fullWidth />
                        <Field label="Last name" name="lastname" placeholder="Doe" component={FinalFormInput} fullWidth />
                    </FormSection>
                </FinalForm>
                <button
                    onClick={() => {
                        //Using apiRef can access FormApi outside of <FinalForm>
                        apiRef.current?.submit();
                    }}
                >
                    submit
                </button>
            </div>
        );
    },

    name: "FinalForm ApiRef",
};

export const SubmitMutationBestPractices = () => {
    const updateUserMutation = gql`
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
    const InnerForm: VoidFunctionComponent<InnerFormProps> = ({ id }) => {
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
};
