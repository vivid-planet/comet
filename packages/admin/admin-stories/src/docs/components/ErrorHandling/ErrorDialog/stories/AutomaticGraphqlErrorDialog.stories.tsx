import { useQuery } from "@apollo/client";
import { Button, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import gql from "graphql-tag";
import * as React from "react";

import { apolloSwapiStoryDecorator } from "../../../../../apollo-swapi-story.decorator";
import { errorDialogStoryProviderDecorator } from "../error-dialog-provider.decorator";

storiesOf("stories/components/Error Handling/Error Dialog/Automatic Graphql Error Dialog", module)
    .addDecorator(apolloSwapiStoryDecorator())
    .addDecorator(errorDialogStoryProviderDecorator())
    .add("Automatic Error on Graphql Error", () => {
        const Story = () => {
            const [brokenQuery, setBrokenQuery] = React.useState(false);
            const query = brokenQuery ? "{ allFilms { films { somenotavailablefield } } }" : "{ allFilms { films { title } } }";
            const { data, error } = useQuery(
                gql`
                    ${query}
                `,
            );
            return (
                <div>
                    <div style={{ backgroundColor: brokenQuery ? "red" : "green" }}>
                        <Typography variant={"h4"}>Current Query: {brokenQuery ? "broken" : "working"}</Typography>
                    </div>
                    <Typography>Query: {query}</Typography>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => {
                            setBrokenQuery(!brokenQuery);
                        }}
                    >
                        <Typography>Change Query</Typography>
                    </Button>
                    {error ? (
                        <div>
                            <Typography>
                                Error:
                                <br />
                                {JSON.stringify(error)}
                            </Typography>
                        </div>
                    ) : (
                        <div>
                            <Typography>
                                Response:
                                <br />
                                {JSON.stringify(data)}
                            </Typography>
                        </div>
                    )}
                </div>
            );
        };
        return <Story />;
    });
