import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { IWithTableQueryProps, withTableQueryContext } from "./table/withTableQueryContext";

interface IProps {
    mutation: any;
    children: (action: (options: { variables: object }) => void, data: { loading: boolean; error: any }) => React.ReactNode;
}
interface IState {
    dialogOpen: boolean;
    loading: boolean;
    pendingVariables?: object;
}
type IncludingInjectedProps = WithApolloClient<IProps> & IWithTableQueryProps;
class DeleteMutation extends React.Component<IncludingInjectedProps, IState> {
    constructor(props: IncludingInjectedProps) {
        super(props);

        this.state = {
            dialogOpen: false,
            loading: false,
            pendingVariables: undefined,
        };
    }
    public render() {
        return (
            <React.Fragment>
                {this.props.children(
                    options => {
                        this.setState({ dialogOpen: true, pendingVariables: options.variables });
                    },
                    {
                        loading: this.state.loading,
                        error: null, // TODO
                    },
                )}

                <Dialog open={this.state.dialogOpen} onClose={this.handleNoClick}>
                    <DialogTitle>Delete row?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Delete row?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleNoClick} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleYesClick} color="primary" autoFocus={true}>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }

    private handleYesClick = () => {
        this.setState({ dialogOpen: false });
        this.setState({ loading: true });
        const refetchQueries = [];
        if (this.props.tableQuery) {
            refetchQueries.push({
                query: this.props.tableQuery.api.getQuery(),
                variables: this.props.tableQuery.api.getVariables(),
            });
        }
        this.props.client
            .mutate({
                mutation: this.props.mutation,
                variables: this.state.pendingVariables,
                refetchQueries,
            })
            .then(() => {
                this.setState({ loading: false });
                if (this.state.pendingVariables) {
                    if (this.props.tableQuery) {
                        this.props.tableQuery.api.onRowDeleted();
                    }
                }
            });
    };

    private handleNoClick = () => {
        this.setState({ dialogOpen: false });
    };
}

const WrappedDeleteMutation = withTableQueryContext(withApollo(DeleteMutation));
export { WrappedDeleteMutation as DeleteMutation };
