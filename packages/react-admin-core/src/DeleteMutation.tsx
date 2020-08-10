import { useApolloClient } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { PureQueryOptions } from "apollo-client";
import * as React from "react";
import { TableQueryContext } from "./table";

interface IProps {
    mutation: any;
    children: (action: (options: { variables: object }) => void, data: { loading: boolean; error: any }) => React.ReactNode;
    refetchQueries?: Array<string | PureQueryOptions>;
}
export function DeleteMutation(props: IProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [pendingVariables, setPendingVariables] = React.useState<object | undefined>(undefined);
    const client = useApolloClient();
    const tableQuery = React.useContext(TableQueryContext);
    const { refetchQueries = [] } = props;

    return (
        <React.Fragment>
            {props.children(
                (options) => {
                    setDialogOpen(true);
                    setPendingVariables(options.variables);
                },
                {
                    loading,
                    error: null, // TODO
                },
            )}

            <Dialog open={dialogOpen} onClose={handleNoClick}>
                <DialogTitle>Datensatz löschen?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleYesClick} color="primary" autoFocus={true} variant="contained">
                        <Typography variant="button">Ja</Typography>
                    </Button>
                    <Button onClick={handleNoClick} color="primary">
                        <Typography variant="button">Nein</Typography>
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );

    function handleYesClick() {
        setDialogOpen(false);
        setLoading(true);
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
