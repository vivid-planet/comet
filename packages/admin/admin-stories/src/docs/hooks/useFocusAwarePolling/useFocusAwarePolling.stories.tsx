import { gql, useQuery } from "@apollo/client";
import { useFocusAwarePolling } from "@comet/admin";
import { Pause, Play } from "@comet/admin-icons";
import { Button, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";

storiesOf("stories/hooks/useFocusAwarePolling", module)
    .addDecorator(apolloStoryDecorator(`https://api.spacex.land/graphql/`))
    .add("Basic example", () => {
        const { data, loading, error, refetch, startPolling, stopPolling } = useQuery(
            gql`
                query LaunchesPast {
                    launchesPastResult(limit: 1) {
                        data {
                            id
                            mission_name
                            launch_date_local
                        }
                    }
                }
            `,
            {
                notifyOnNetworkStatusChange: true, // Only necessary to show loading indicator while polling
            },
        );

        useFocusAwarePolling({
            pollInterval: 10000,
            refetch,
            startPolling,
            stopPolling,
        });

        return (
            <>
                <Typography>
                    Most recent launch:
                    {loading
                        ? "Checking..."
                        : data && (
                              <>
                                  {data.launchesPastResult.data[0].mission_name}, {data.launchesPastResult.data[0].launch_date_local}
                              </>
                          )}
                </Typography>
                {error && <Typography color="error">Error: {JSON.stringify(error)}</Typography>}
            </>
        );
    })
    .add("With skip option", () => {
        const [paused, setPaused] = React.useState(false);

        const { data, loading, error, refetch, startPolling, stopPolling } = useQuery(
            gql`
                query LaunchesPast {
                    launchesPastResult(limit: 1) {
                        data {
                            id
                            mission_name
                            launch_date_local
                        }
                    }
                }
            `,
            {
                notifyOnNetworkStatusChange: true, // Only necessary to show loading indicator while polling
                skip: paused,
            },
        );

        useFocusAwarePolling({
            pollInterval: 10000,
            skip: paused, // <-- Make sure to add skip here too!
            refetch,
            startPolling,
            stopPolling,
        });

        return (
            <>
                <Typography>
                    Most recent launch:
                    {loading
                        ? "Checking..."
                        : data && (
                              <>
                                  {data.launchesPastResult.data[0].mission_name}, {data.launchesPastResult.data[0].launch_date_local}
                              </>
                          )}
                </Typography>
                <Button onClick={() => setPaused(!paused)} startIcon={paused ? <Play /> : <Pause />}>
                    {paused ? "Resume" : "Pause"}
                </Button>
                {error && <Typography color="error">Error: {JSON.stringify(error)}</Typography>}
            </>
        );
    });
