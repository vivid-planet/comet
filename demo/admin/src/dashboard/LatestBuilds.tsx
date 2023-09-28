import { gql } from "@apollo/client";
import { useTableQuery } from "@comet/admin";
import { LatestBuildsDashboardWidget } from "@comet/cms-admin";
import * as React from "react";

import { GQLLatestBuildsQuery, GQLLatestBuildsQueryVariables } from "./LatestBuilds.generated";

export const LatestBuilds: React.FC = () => {
    const tableQuery = useTableQuery<GQLLatestBuildsQuery, GQLLatestBuildsQueryVariables>()(LATEST_BUILDS, {
        resolveTableData: (data) => ({
            data: data.builds,
            totalCount: 5,
        }),
    });

    return <LatestBuildsDashboardWidget tableQuery={tableQuery} />;
};

const LATEST_BUILDS = gql`
    query LatestBuilds {
        builds(limit: 5) {
            id
            status
            name
            trigger
            startTime
            completionTime
        }
    }
`;
