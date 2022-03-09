import { useMutation } from "@apollo/client";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { DocumentNode } from "graphql";
import * as React from "react";

interface IProps {
    updateMutation: DocumentNode | TypedDocumentNode<unknown, unknown>;
    createMutation: DocumentNode | TypedDocumentNode<unknown, unknown>;
    // TODO  use MutationFn<TData, TVariables> for update and create
    children: (actions: { update: () => void; create: () => void }, data: { loading: boolean; error: unknown }) => React.ReactNode;
}

export function FormMutation(props: IProps): React.ReactElement {
    const [update, { loading: updateLoading, error: updateError }] = useMutation(props.updateMutation);
    const [create, { loading: createLoading, error: createError }] = useMutation(props.createMutation);
    return this.props.children(
        { update, create },
        {
            loading: updateLoading || createLoading,
            error: updateError || createError,
        },
    );
}
