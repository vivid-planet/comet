import { gql, useQuery } from "@apollo/client";
import { type GridColDef } from "@comet/admin";
import { Reload } from "@comet/admin-icons";
import { DataGrid } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardWidgetRoot } from "./DashboardWidgetRoot";
import { type GQLLatestBuildsQuery } from "./LatestBuildsDashboardWidget.generated";
import { type GQLLatestWarningsQuery, type GQLLatestWarningsQueryVariables } from "./LatestWarningsDashboardWidget.generated";

export const LatestWarningsDashboardWidget = () => {
    const { data, loading, error } = useQuery<GQLLatestWarningsQuery, GQLLatestWarningsQueryVariables>(latestWarningsQuery);

    const intl = useIntl();
    if (error) {
        throw error;
    }

    console.log("data", data);

    const columns: GridColDef<GQLLatestBuildsQuery["builds"][number]>[] = [
        {
            ...disableFieldOptions,
            field: "message",
            headerName: intl.formatMessage({ id: "dashboard.latestWarningsWidget.message", defaultMessage: "Message" }),
            flex: 1,
        },
        {
            ...disableFieldOptions,
            field: "type",
            headerName: intl.formatMessage({ id: "dashboard.latestWarningsWidget.type", defaultMessage: "Type" }),
            width: 150,
        },
        {
            ...disableFieldOptions,
            field: "severity",
            headerName: intl.formatMessage({ id: "dashboard.latestWarningsWidget.severity", defaultMessage: "Severity" }),
            width: 150,
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

const latestWarningsQuery = gql`
    query LatestWarnings {
        warnings(limit: 5) {
            nodes {
                id
                message
                type
                severity
                sourceInfo {
                    jsonPath
                }
            }
        }
    }
`;
