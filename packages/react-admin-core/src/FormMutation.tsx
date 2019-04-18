import * as React from "react";
import { Mutation } from "react-apollo";

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
                {(update, { loading: updateLoading, error: updateError }) => (
                    <Mutation mutation={this.props.createMutation}>
                        {(create, { loading: createLoading, error: createError }) =>
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
