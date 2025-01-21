import { gql, useQuery } from "@apollo/client";
import { GridColDef, Loading, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Select } from "@comet/admin-icons";
import { Button, Card, CardContent, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import { GQLContentScopesQuery, GQLContentScopesQueryVariables } from "./ContentScopeGrid.generated";
import { SelectScopesDialog } from "./selectScopesDialog/SelectScopesDialog";

export const ContentScopeGrid = ({ userId }: { userId: string }) => {
    const intl = useIntl();
    const [open, setOpen] = useState(false);

    const { data, error } = useQuery<GQLContentScopesQuery, GQLContentScopesQueryVariables>(
        gql`
            query ContentScopes($userId: String!) {
                availableContentScopes: userPermissionsAvailableContentScopes
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
                    <ToolbarFillSpace />
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
                        sx={{ "&.MuiDataGrid-root .MuiDataGrid-cell": { py: "8px" } }}
                    />
                </CardContent>
            </Card>
            <SelectScopesDialog open={open} onClose={() => setOpen(false)} data={data} userId={userId} />
        </>
    );
};

const CardToolbar = styled(Toolbar)`
    top: 0px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;

export function generateGridColumnsFromContentScopeProperties(
    data: GQLContentScopesQuery["userContentScopes"] | GQLContentScopesQuery["availableContentScopes"],
    intl: IntlShape,
): GridColDef[] {
    const uniquePropertyNames = Array.from(new Set(data.flatMap((item) => Object.keys(item))));
    return uniquePropertyNames.map((propertyName) => {
        return {
            field: propertyName,
            flex: 1,
            pinnable: false,
            sortable: false,
            filterable: false,
            headerName: camelCaseToHumanReadable(
                intl.formatMessage({ id: `comet.userPermissions.contentScope.${propertyName}`, defaultMessage: propertyName }),
            ),
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
