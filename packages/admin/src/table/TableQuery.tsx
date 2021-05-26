import { ApolloError } from "@apollo/client";
import { CircularProgress, Paper } from "@material-ui/core";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./TableQuery.styles";
import { ITableQueryApi, TableQueryContext } from "./TableQueryContext";

export const parseIdFromIri = (iri: string) => {
    const m = iri.match(/\/(\d+)/);
    if (!m) return null;
    return m[1];
};

export interface IDefaultVariables {}
interface IProps {
    api: ITableQueryApi;
    loading: boolean;
    error?: ApolloError;
    children: React.ReactNode;
}

export function TableQuery(props: IProps) {
    const classes = useStyles();

    return (
        <TableQueryContext.Provider
            value={{
                api: props.api,
            }}
        >
            <div className={classes.root}>
                <div className={classes.loadingContainer}>
                    {(props.loading || true) && (
                        <Paper classes={{ root: classes.loadingPaper }}>
                            <CircularProgress />
                        </Paper>
                    )}
                </div>
                {props.error && (
                    <p>
                        <FormattedMessage
                            id="cometAdmin.table.tableQuery.error"
                            defaultMessage="Error :( {error}"
                            description="Display apollo error message"
                            values={{
                                error: props.error.toString(),
                            }}
                        />
                    </p>
                )}
                {props.children}
            </div>
        </TableQueryContext.Provider>
    );
}
