import { gql, useQuery } from "@apollo/client";
import {
    CancelButton,
    FillSpace,
    type GridColDef,
    Loading,
    messages,
    SaveBoundary,
    SaveBoundarySaveButton,
    ToolbarActions,
    ToolbarTitleItem,
} from "@comet/admin";
import { Select } from "@comet/admin-icons";
import {
    Button,
    Card,
    CardContent,
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogActions,
    DialogTitle,
    Toolbar,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import { type GQLContentScopesQuery, type GQLContentScopesQueryVariables } from "./ContentScopeGrid.generated";
import { SelectScopesDialogContent } from "./selectScopesDialogContent/SelectScopesDialogContent";
import { type GQLAvailableContentScopesQuery } from "./selectScopesDialogContent/SelectScopesDialogContent.generated";

type ContentScope = {
    [key: string]: string;
};

export const ContentScopeGrid = ({ userId }: { userId: string }) => {
    const [open, setOpen] = useState(false);

    const { data, error } = useQuery<GQLContentScopesQuery, GQLContentScopesQueryVariables>(
        gql`
            query ContentScopes($userId: String!) {
                userContentScopes: userPermissionsContentScopes(userId: $userId)
                userContentScopesSkipManual: userPermissionsContentScopes(userId: $userId, skipManual: true)
            }
        `,
        {
            variables: { userId },
        },
    );

    if (error) throw new Error(error.message);

    if (!data) {
        return <Loading />;
    }

    const columns: GridColDef<ContentScope>[] = generateGridColumnsFromContentScopeProperties(data.userContentScopes);

    return (
        <>
            <Card>
                <CardToolbar>
                    <ToolbarTitleItem>
                        <FormattedMessage id="comet.userPermissions.scopes" defaultMessage="Scopes" />
                    </ToolbarTitleItem>
                    <FillSpace />
                    <ToolbarActions>
                        <Button startIcon={<Select />} onClick={() => setOpen(true)} variant="contained" color="primary">
                            <FormattedMessage id="comet.userPermissions.selectScopes" defaultMessage="Select scopes" />
                        </Button>
                    </ToolbarActions>
                </CardToolbar>
                <CardContent>
                    <DataGrid
                        autoHeight={true}
                        rows={data.userContentScopes ?? []}
                        columns={columns}
                        rowCount={data?.userContentScopes.length ?? 0}
                        loading={false}
                        getRowHeight={() => "auto"}
                        getRowId={(row) => JSON.stringify(row)}
                    />
                </CardContent>
            </Card>
            <SaveBoundary
                onAfterSave={() => {
                    setOpen(false);
                }}
            >
                <Dialog open={open} maxWidth="lg">
                    <DialogTitle>
                        <FormattedMessage id="comet.userScopes.dialog.title" defaultMessage="Select scopes" />
                    </DialogTitle>
                    <SelectScopesDialogContent
                        userId={userId}
                        userContentScopes={data.userContentScopes}
                        userContentScopesSkipManual={data.userContentScopesSkipManual}
                    />
                    <DialogActions>
                        <CancelButton onClick={() => setOpen(false)}>
                            <FormattedMessage {...messages.close} />
                        </CancelButton>
                        <SaveBoundarySaveButton />
                    </DialogActions>
                </Dialog>
            </SaveBoundary>
        </>
    );
};

const CardToolbar = styled(Toolbar)`
    top: 0px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;

export function generateGridColumnsFromContentScopeProperties(
    data: GQLContentScopesQuery["userContentScopes"] | GQLAvailableContentScopesQuery["availableContentScopes"],
): GridColDef[] {
    const uniquePropertyNames = Array.from(new Set(data.flatMap((item) => Object.keys(item))));
    return uniquePropertyNames.map((propertyName) => {
        return {
            field: propertyName,
            flex: 1,
            pinnable: false,
            sortable: false,
            filterable: true,
            headerName: camelCaseToHumanReadable(propertyName),
            renderCell: ({ row }) => {
                if (row[propertyName] != null) {
                    return <Typography variant="subtitle2">{camelCaseToHumanReadable(row[propertyName])}</Typography>;
                } else {
                    return "-";
                }
            },
        };
    });
}
