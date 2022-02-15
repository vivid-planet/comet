import { ErrorBoundary } from "@comet/admin";
import { Box, Card, CardContent, Link, Typography } from "@mui/material";
import { Alert } from "@mui/material";
import { boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const ViewWithNoError: React.FunctionComponent = () => {
    return (
        <div>
            <Typography>View with No Error</Typography>
        </div>
    );
};

const ViewWithError: React.FunctionComponent = () => {
    throw new Error("Some error occurred");
    return (
        <div>
            <Typography>Error</Typography>
        </div>
    );
};
function Story() {
    const renderViewWithErrors = boolean("Render view with error", false);
    return (
        <>
            <Box marginBottom={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant={"h3"} gutterBottom>
                            Error Boundaries
                        </Typography>
                        <Alert severity={"info"}>
                            <Typography paragraph>
                                Error boundaries catch errors anywhere in their child component tree, stops the whole application from crashing and
                                show a UI to the User to the affected area. The rest of the application should still be accessible
                            </Typography>
                            <Typography paragraph>
                                More infos to Error Boundaries can be found here:{" "}
                                <Link href={"https://reactjs.org/docs/error-boundaries.html"}>https://reactjs.org/docs/error-boundaries.html</Link>
                            </Typography>
                            <Typography paragraph>Go to knobs and try to render a view with an error</Typography>
                        </Alert>
                    </CardContent>
                </Card>
            </Box>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant={"h5"} gutterBottom>
                        Error Boundaries
                    </Typography>
                    {/* TODO: Fix this */}
                    {/* @ts-ignore */}
                    <ErrorBoundary key={`errorBoundary_${renderViewWithErrors}`}>
                        {renderViewWithErrors ? <ViewWithError /> : <ViewWithNoError />}
                    </ErrorBoundary>
                </CardContent>
            </Card>
        </>
    );
}

storiesOf("@comet/admin/error-handling/error-boundaries", module).add("ErrorBoundary", () => <Story />);
