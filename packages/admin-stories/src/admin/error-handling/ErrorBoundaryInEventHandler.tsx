import { ErrorBoundary, useErrorBoundary } from "@comet/admin";
import { Button, Link, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { storiesOf } from "@storybook/react";
import * as React from "react";

const ExampleView: React.FunctionComponent = () => {
    const errorBoundary = useErrorBoundary();
    return (
        <div>
            <Typography>View with No Error</Typography>
            <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => {
                    errorBoundary.throwException(new Error("Some error occured"));
                }}
            >
                Throw Error in Event Handler
            </Button>
        </div>
    );
};

function Story() {
    return (
        <>
            <Typography variant={"h3"}>Error Boundaries</Typography>

            <Alert severity={"info"}>
                <Typography paragraph={true}>
                    Error boundaries do not work out of the box in event handler. With the useErrorBoundary() Hook we can use the error boundary
                    explicitly e.g. in event handler or any where else.The useErrorBoundary() hook throws an error directly in the jsx, which than be
                    handled from the ErrorBoundary.
                </Typography>
                <Typography paragraph={true}>
                    More infos to Error Boundaries:{" "}
                    <Link href={"https://reactjs.org/docs/error-boundaries.html"}>https://reactjs.org/docs/error-boundaries.html</Link>
                </Typography>

                <Typography paragraph={true}>
                    Try to press the <b>Throw Error in Event Handler</b> button below to produce a runtime error.
                </Typography>
            </Alert>

            <Paper style={{ padding: 30, marginTop: 40 }}>
                <Typography>Error Boundaries</Typography>
                <ErrorBoundary>
                    <ExampleView />
                </ErrorBoundary>
            </Paper>
        </>
    );
}

storiesOf("@comet/admin/error-handling/error-boundaries", module).add("ErrorBoundaryInEventHandler", () => <Story />);
