import { gql, useQuery } from "@apollo/client";
import { dataGridDateTimeColumn, type GridColDef } from "@comet/admin";
import { Reload } from "@comet/admin-icons";
import { DataGrid } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";

import { useContentScope } from "../contentScope/Provider";
import { DashboardWidgetRoot } from "../dashboard/widgets/DashboardWidgetRoot";
import {
    type GQLLatestWarningsListFragment,
    type GQLLatestWarningsQuery,
    type GQLLatestWarningsQueryVariables,
} from "./LatestWarningsDashboardWidget.generated";
import { WarningActions } from "./WarningActions";
import { useWarningConfig } from "./warningConfig";
import { WarningMessage } from "./WarningMessage";
import { WarningSeverity } from "./WarningSeverity";

export const LatestWarningsDashboardWidget = () => {
    const { values: scopeValues } = useContentScope();
    const { warningMessages } = useWarningConfig();
    const scopes = scopeValues.map((item) => item.scope);

    const { data, loading, error } = useQuery<GQLLatestWarningsQuery, GQLLatestWarningsQueryVariables>(latestWarningsQuery, {
        variables: { scopes },
    });

    const intl = useIntl();
    if (error) {
        throw error;
    }

    const columns: GridColDef<GQLLatestWarningsListFragment>[] = [
        {
            ...disableFieldOptions,
            field: "message",
            headerName: intl.formatMessage({ id: "dashboard.latestWarningsWidget.message", defaultMessage: "Message" }),
            flex: 1,
            renderCell: (params) => <WarningMessage message={params.value} warningMessages={warningMessages} />,
        },
        {
            ...dataGridDateTimeColumn,
            ...disableFieldOptions,
            field: "createdAt",
            headerName: intl.formatMessage({ id: "dashboard.latestWarningsWidget.dateTime", defaultMessage: "Date / Time" }),
            flex: 1,
        },
        {
            ...disableFieldOptions,
            field: "severity",
            headerName: intl.formatMessage({ id: "dashboard.latestWarningsWidget.severity", defaultMessage: "Severity" }),
            renderCell: (params) => <WarningSeverity severity={params.value} />,
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            renderCell: ({ row }) => <WarningActions sourceInfo={row.sourceInfo} />,
        },
    ];

    return (
        <DashboardWidgetRoot
            icon={<Reload />}
            header={<FormattedMessage id="dashboard.latestWarningsWidget.title" defaultMessage="Latest Warnings" />}
        >
            <DataGrid disableColumnMenu hideFooter columns={columns} rows={data?.warnings.nodes ?? []} loading={loading} />
        </DashboardWidgetRoot>
    );
};

const disableFieldOptions = {
    filterable: false,
    sortable: false,
    hideable: false,
};

const latestWarningsFragments = gql`
    fragment LatestWarningsList on Warning {
        id
        createdAt
        message
        severity
        sourceInfo {
            rootEntityName
            jsonPath
            rootColumnName
            targetId
        }
    }
`;

const latestWarningsQuery = gql`
    query LatestWarnings($scopes: [JSONObject!]!) {
        warnings(limit: 5, scopes: $scopes, sort: { field: createdAt, direction: DESC }) {
            nodes {
                ...LatestWarningsList
            }
        }
    }
    ${latestWarningsFragments}
`;
