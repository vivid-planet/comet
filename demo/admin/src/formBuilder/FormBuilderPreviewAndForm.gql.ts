import { gql } from "@apollo/client";

export const editFormBuilderFragment = gql`
    fragment EditFormBuilderForm on FormBuilder {
        id
        name
        submitButtonText
        updatedAt
        blocks
    }
`;

export const formBuilderDetailQuery = gql`
    query FormBuilderDetail($id: ID!) {
        formBuilder(id: $id) {
            ...EditFormBuilderForm
        }
    }

    ${editFormBuilderFragment}
`;

export const updateFormBuilderMutation = gql`
    mutation UpdateFormBuilder($id: ID!, $input: FormBuilderUpdateInput!) {
        formBuilder: updateFormBuilder(id: $id, input: $input) {
            ...EditFormBuilderForm
        }
    }

    ${editFormBuilderFragment}
`;

export const createFormBuilderMutation = gql`
    mutation CreateFormBuilder($scope: FormBuilderContentScopeInput!, $input: FormBuilderInput!) {
        formBuilder: createFormBuilder(scope: $scope, input: $input) {
            ...EditFormBuilderForm
        }
    }

    ${editFormBuilderFragment}
`;

export const checkForChangesQuery = gql`
    query CheckForChangesFormBuilder($id: ID!) {
        formBuilder(id: $id) {
            updatedAt
        }
    }
`;
