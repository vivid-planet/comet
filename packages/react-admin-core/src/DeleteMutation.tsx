import { useApolloClient } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";
import { TableQueryContext } from "./table";
import { FormattedMessage } from "react-intl";

interface IProps {
    mutation: any;
    children: (action: (options: { variables: object }) => void, data: { loading: boolean; error: any }) => React.ReactNode;
}
export function DeleteMutation(props: IProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [pendingVariables, setPendingVariables] = React.useState<object | undefined>(undefined);
    const client = useApolloClient();
    const tableQuery = React.useContext(TableQueryContext);
    return (
        <React.Fragment>
            {props.children(
                options => {
                    setDialogOpen(true);
                    setPendingVariables(options.variables);
                },
                {
                    loading,
                    error: null, // TODO
                },
            )}

            <Dialog open={dialogOpen} onClose={handleNoClick}>
                <DialogTitle>
                    <FormattedMessage
                        id="reactAdmin.core.deleteMutation.promptDelete"
                        defaultMessage="Datensatz löschen?"
                        description="Prompt to delete an item"
                    />
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleYesClick} color="primary" autoFocus={true} variant="contained">
                        <FormattedMessage id="reactAdmin.core.deleteMutation.yes" defaultMessage="Ja" description="delete yes" />
                    </Button>
                    <Button onClick={handleNoClick} color="primary">
                        <FormattedMessage id="reactAdmin.core.deleteMutation.no" defaultMessage="Nein" description="delete no" />
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );

    function handleYesClick() {
        setDialogOpen(false);
        setLoading(true);
        const refetchQueries = [];
        if (tableQuery) {
            refetchQueries.push({
                query: tableQuery.api.getQuery(),
                variables: tableQuery.api.getVariables(),
            });
        }
        client
            .mutate({
                mutation: props.mutation,
                variables: pendingVariables,
                refetchQueries,
            })
            .then(() => {
                setLoading(false);
                if (pendingVariables) {
                    if (tableQuery) {
                        tableQuery.api.onRowDeleted();
                    }
                }
            });
    }

    function handleNoClick() {
        setDialogOpen(false);
    }
}
