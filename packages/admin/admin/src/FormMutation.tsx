import { useMutation } from "@apollo/client";
import * as React from "react";

interface IProps {
    updateMutation: any;
    createMutation: any;
    // TODO  use MutationFn<TData, TVariables> for update and create
    children: (actions: { update: () => void; create: () => void }, data: { loading: boolean; error: any }) => React.ReactNode;
}

export function FormMutation(props: IProps) {
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
