import { gql, useMutation } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import { Button, CircularProgress, createStyles, makeStyles, Theme } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import clsx from "clsx";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLCreateBuildMutation, namedOperations } from "../graphql.generated";

const createBuildMutation = gql`
    mutation CreateBuild {
        createBuild
    }
`;

export const PublishButton: React.FunctionComponent = () => {
    const classes = useStyles();
    const [startBuild, { loading, error, data }] = useMutation<GQLCreateBuildMutation>(createBuildMutation);
    const [hasStarted, setHasStarted] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
        if (error) {
            setHasError(true);

            const timeout = window.setTimeout(() => {
                setHasError(false);
            }, 2000);

            return () => {
                window.clearTimeout(timeout);
            };
        }
    }, [error]);

    React.useEffect(() => {
        if (data?.createBuild === true) {
            setHasStarted(true);

            const timeout = window.setTimeout(() => {
                setHasStarted(false);
            }, 2000);

            return () => {
                window.clearTimeout(timeout);
            };
        }
    }, [data]);

    const handlePublishClick = () => {
        startBuild({
            refetchQueries: [namedOperations.Query.Builds],
            context: LocalErrorScopeApolloContext,
        });
    };

    return (
        <div className={classes.wrapper}>
            <Button
                variant="contained"
                color="primary"
                className={clsx({
                    [classes.buttonSuccess]: hasStarted,
                    [classes.buttonError]: hasError,
                })}
                disabled={loading}
                onClick={handlePublishClick}
                fullWidth
            >
                {hasStarted && <FormattedMessage id="comet.pages.publisher.buildStarted" defaultMessage="Build started" />}
                {hasError && <FormattedMessage id="comet.pages.publisher.buildStarted" defaultMessage="Build start failed" />}
                {!hasStarted && !hasError && <FormattedMessage id="comet.pages.publisher.build" defaultMessage="Start build" />}
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            position: "relative",
            width: "100%",
            margin: theme.spacing(1),
        },
        buttonSuccess: {
            backgroundColor: green[500],
            "&:hover": {
                backgroundColor: green[700],
            },
        },
        buttonError: {
            backgroundColor: red[500],
            "&:hover": {
                backgroundColor: red[700],
            },
        },
        buttonProgress: {
            color: green[500],
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -12,
            marginLeft: -12,
        },
    }),
);
