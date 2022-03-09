import { PureQueryOptions, useApolloClient } from "@apollo/client";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { CancelButton } from "./common/buttons/cancel/CancelButton";
import { DeleteButton } from "./common/buttons/delete/DeleteButton";
import { TableQueryContext } from "./table/TableQueryContext";

interface IProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutation: any;
    children: (action: (options: { variables: Record<string, unknown> }) => void, data: { loading: boolean; error: unknown }) => React.ReactNode;
    refetchQueries?: Array<string | PureQueryOptions>;
}
export function DeleteMutation(props: IProps): React.ReactElement {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [pendingVariables, setPendingVariables] = React.useState<Record<string, unknown> | undefined>(undefined);
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

            <Dialog open={dialogOpen} onClose={handleNoClick} maxWidth="xs">
                <DialogTitle>
                    <FormattedMessage
                        id="cometAdmin.deleteMutation.promptDelete"
                        defaultMessage="Delete item?"
                        description="Prompt to delete an item"
                    />
                </DialogTitle>
                <DialogActions>
                    <CancelButton onClick={handleNoClick} />
                    <DeleteButton onClick={handleYesClick} autoFocus />
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
