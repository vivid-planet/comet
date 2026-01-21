import { useQuery } from "@apollo/client";
import { DataGridToolbar, type GridColDef, ToolbarTitleItem, useBufferedRowCount, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { type ContentScope } from "@comet/cms-admin";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { type ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { allAssignedBrevoContactsGridQuery } from "./AllAssignedContactsGrid.gql";
import {
    type GQLBrevoContactsQuery,
    type GQLBrevoContactsQueryVariables,
    type GQLTargetGroupBrevoContactsListFragment,
} from "./AllAssignedContactsGrid.gql.generated";

const AssignedContactsGridToolbar = () => {
    const intl = useIntl();

    return (
        <DataGridToolbar>
            <ToolbarTitleItem>
                <FormattedMessage id="cometBrevoModule.targetGroup.allAssignedContacts.title" defaultMessage="All assigned contacts" />
            </ToolbarTitleItem>
            <GridToolbarQuickFilter
                placeholder={intl.formatMessage({
                    id: "cometBrevoModule.targetGroup.assignedContacts.searchEmail",
                    defaultMessage: "Search email address",
                })}
            />
        </DataGridToolbar>
    );
};

interface AllAssignedContactsGridProps {
    scope: ContentScope;
    id: string;
    brevoId?: number;
}

export function AllAssignedContactsGrid({ id, scope, brevoId }: AllAssignedContactsGridProps): ReactElement {
    const intl = useIntl();
    const dataGridAllAssignedContactsProps = { ...useDataGridRemote(), ...usePersistentColumnState("TargetGroupAssignedBrevoContactsGrid") };

    const {
        data: allAssignedContactsData,
        loading: assignedContactsLoading,
        error: allAssignedContactsError,
    } = useQuery<GQLBrevoContactsQuery, GQLBrevoContactsQueryVariables>(allAssignedBrevoContactsGridQuery, {
        variables: {
            offset: dataGridAllAssignedContactsProps.paginationModel.page * dataGridAllAssignedContactsProps.paginationModel.pageSize,
            limit: dataGridAllAssignedContactsProps.paginationModel.pageSize,
            email: dataGridAllAssignedContactsProps.filterModel?.quickFilterValues
                ? dataGridAllAssignedContactsProps.filterModel?.quickFilterValues[0]
                : undefined,
            targetGroupId: id,
            scope,
        },
        skip: !brevoId,
    });

    const allAssignedContactsColumns: GridColDef<GQLTargetGroupBrevoContactsListFragment>[] = [
        {
            field: "createdAt",
            headerName: intl.formatMessage({ id: "cometBrevoModule.brevoContact.subscribedAt", defaultMessage: "Subscribed At" }),
            filterable: false,
            sortable: false,
            width: 150,
            renderCell: ({ row }) => intl.formatDate(new Date(row.createdAt)),
        },
        {
            field: "modifiedAt",
            headerName: intl.formatMessage({ id: "cometBrevoModule.brevoContact.modifiedAt", defaultMessage: "Modified At" }),
            filterable: false,
            sortable: false,
            width: 150,
            renderCell: ({ row }) => intl.formatDate(new Date(row.modifiedAt)),
        },
        {
            field: "email",
            headerName: intl.formatMessage({ id: "cometBrevoModule.brevoContact.email", defaultMessage: "Email" }),
            filterable: false,
            sortable: false,
            width: 150,
            flex: 1,
        },
        {
            field: "emailBlacklisted",
            headerName: intl.formatMessage({ id: "cometBrevoModule.brevoContact.emailBlocked", defaultMessage: "Email blocked" }),
            type: "boolean",
            filterable: false,
            sortable: false,
            width: 150,
        },
    ];

    const allAssignedContactsRowCount = useBufferedRowCount(allAssignedContactsData?.brevoContacts.totalCount);

    if (allAssignedContactsError) throw allAssignedContactsError;

    return (
        <DataGrid
            {...dataGridAllAssignedContactsProps}
            disableRowSelectionOnClick
            rows={allAssignedContactsData?.brevoContacts.nodes ?? []}
            rowCount={allAssignedContactsRowCount}
            columns={allAssignedContactsColumns}
            autoHeight
            loading={assignedContactsLoading}
            slots={{
                toolbar: AssignedContactsGridToolbar,
            }}
        />
    );
}
