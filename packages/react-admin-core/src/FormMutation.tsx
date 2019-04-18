import * as React from "react";
import { Mutation, MutationFn, MutationResult } from "react-apollo";

interface IProps {
    updateMutation: any;
    createMutation: any;
    // TODO  use MutationFn<TData, TVariables> for update and create
    children: (actions: { update: () => void; create: () => void }, data: { loading: boolean; error: any }) => React.ReactNode;
}

export class FormMutation extends React.Component<IProps> {
    public render() {
        return (
            <Mutation mutation={this.props.updateMutation}>
                {(update: MutationFn, { loading: updateLoading, error: updateError }: MutationResult) => (
                    <Mutation mutation={this.props.createMutation}>
                        {(create: MutationFn, { loading: createLoading, error: createError }: MutationResult) =>
                            this.props.children(
                                { update, create },
                                {
                                    loading: updateLoading || createLoading,
                                    error: updateError || createError,
                                },
                            )
                        }
                    </Mutation>
                )}
            </Mutation>
        );
    }
}
