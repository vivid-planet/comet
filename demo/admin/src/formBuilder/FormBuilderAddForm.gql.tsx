// TODO: Remove this file once the generator can handle this (FormBuilderAddForm.cometGen.ts)

import { gql } from "@apollo/client";

export const formBuilderFormFragment = gql`
    fragment FormBuilderAddForm on FormBuilder {
        name
        submitButtonText
    }
`;
export const createFormBuilderMutation = gql`
    mutation CreateFormBuilder($scope: FormBuilderContentScopeInput!, $input: FormBuilderInput!) {
        createFormBuilder(scope: $scope, input: $input) {
            id
            updatedAt
            ...FormBuilderAddForm
        }
    }
    ${formBuilderFormFragment}
`;
