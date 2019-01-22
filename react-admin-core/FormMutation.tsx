import * as React from "react";
import { Mutation } from "react-apollo";

interface IProps {
    updateMutation: any;
    createMutation: any;
    children: (actions: { update: Function; create: Function }, data: { loading: boolean; error: any }) => React.ReactNode;
}

class FormMutation extends React.Component<IProps> {
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

export default FormMutation;
