import { gql, useQuery } from "@apollo/client";
import { StackPageTitle } from "@comet/admin";
import React, { PropsWithChildren, ReactNode } from "react";
import { useIntl } from "react-intl";

import { GQLFormBuilderNameQuery, GQLFormBuilderNameQueryVariables } from "./FormBuilderFormStackPageTitle.generated";

export const FormStackPageTitle = ({ children, formBuilderId }: PropsWithChildren<{ formBuilderId?: string }>) => {
    if (formBuilderId) {
        return <EditFormBuilderStackPageTitle formBuilderId={formBuilderId}>{children}</EditFormBuilderStackPageTitle>;
    }
    return <AddFormBuilderStackPageTitle>{children}</AddFormBuilderStackPageTitle>;
};

const AddFormBuilderStackPageTitle = ({ children }: { children?: ReactNode }) => {
    const intl = useIntl();
    return <StackPageTitle title={intl.formatMessage({ id: "formBuilder.newForm", defaultMessage: "New Form" })}>{children}</StackPageTitle>;
};

const EditFormBuilderStackPageTitle = ({ children, formBuilderId }: PropsWithChildren<{ formBuilderId: string }>) => {
    const { data } = useQuery<GQLFormBuilderNameQuery, GQLFormBuilderNameQueryVariables>(
        formBuilderNameQuery,
        formBuilderId ? { variables: { id: formBuilderId } } : { skip: true },
    );

    return <StackPageTitle title={data?.formBuilder?.name}>{children}</StackPageTitle>;
};

const formBuilderNameQuery = gql`
    query FormBuilderName($id: ID!) {
        formBuilder(id: $id) {
            id
            name
        }
    }
`;
