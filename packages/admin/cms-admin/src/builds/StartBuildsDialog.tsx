import { gql, useMutation, useQuery } from "@apollo/client";
import { CancelButton, LocalErrorScopeApolloContext } from "@comet/admin";
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid, GridSelectionModel } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GQLBuildTemplatesQuery, GQLCreateBuildsMutation, GQLCreateBuildsMutationVariables, namedOperations } from "../graphql.generated";

const buildTemplatesQuery = gql`
    query BuildTemplates {
        buildTemplates {
            id
            name
            label
        }
    }
`;

const createBuildsMutation = gql`
    mutation CreateBuilds($input: CreateBuildsInput!) {
        createBuilds(input: $input)
    }
`;

type StartBuildsDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function StartBuildsDialog(props: StartBuildsDialogProps) {
    const { open, onClose } = props;

    const intl = useIntl();

    const { data } = useQuery<GQLBuildTemplatesQuery>(buildTemplatesQuery, {
        context: LocalErrorScopeApolloContext,
    });
    const [startBuilds, { loading }] = useMutation<GQLCreateBuildsMutation, GQLCreateBuildsMutationVariables>(createBuildsMutation, {
        refetchQueries: [namedOperations.Query.Builds],
    });

    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const rows = data?.buildTemplates ?? [];

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="comet.pages.publisher.startBuildsDialog.header" defaultMessage="Start manual builds" />
            </DialogTitle>
            <DialogContent>
                <Alert severity="info">
                    <FormattedMessage
                        id="comet.pages.publisher.startBuildsDialog.hint"
                        defaultMessage="Please use this function only in exceptional cases. The more builds you start, the longer it takes until they are completed. If you need to rebuild manually, select only the scopes required."
                    />
                </Alert>
                <DataGrid
                    autoHeight
                    rows={rows}
                    columns={[
                        {
                            field: "name",
                            headerName: intl.formatMessage({
                                id: "comet.pages.publisher.startBuildsDialog.buildTemplates.name",
                                defaultMessage: "Name",
                            }),
                            flex: 1,
                            renderCell: ({ row }) => {
                                return row.label ?? row.name;
                            },
                        },
                    ]}
                    checkboxSelection
                    disableColumnSelector
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    selectionModel={selectionModel}
                    pageSize={5}
                    hideFooterPagination={rows.length <= 5}
                />
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={() => onClose()} />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={loading || selectionModel.length < 1}
                    startIcon={loading ? <CircularProgress size={20} /> : undefined}
                    onClick={async () => {
                        await startBuilds({
                            variables: { input: { names: rows.filter((row) => selectionModel.includes(row.id)).map((row) => row.name) } },
                        });
                        onClose();
                    }}
                >
                    <FormattedMessage id="comet.pages.publisher.startBuildsDialog.button" defaultMessage="Start builds" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}
