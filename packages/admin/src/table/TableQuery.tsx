import { ApolloError } from "@apollo/client";
import { CircularProgress, Paper, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { styles, TableQueryClassKey } from "./TableQuery.styles";
import { ITableQueryApi, TableQueryContext } from "./TableQueryContext";

export const parseIdFromIri = (iri: string) => {
    const m = iri.match(/\/(\d+)/);
    if (!m) return null;
    return m[1];
};

export interface IDefaultVariables {}

export interface IProps {
    api: ITableQueryApi;
    loading: boolean;
    error?: ApolloError;
    children: React.ReactNode;
}

export function Query({ classes, ...otherProps }: IProps & WithStyles<typeof styles>) {
    return (
        <TableQueryContext.Provider
            value={{
                api: otherProps.api,
            }}
        >
            <div className={classes.root}>
                <div className={classes.loadingContainer}>
                    {otherProps.loading && (
                        <Paper classes={{ root: classes.loadingPaper }}>
                            <CircularProgress />
                        </Paper>
                    )}
                </div>
                {otherProps.error && (
                    <p>
                        <FormattedMessage
                            id="cometAdmin.table.tableQuery.error"
                            defaultMessage="Error :( {error}"
                            description="Display apollo error message"
                            values={{
                                error: otherProps.error.toString(),
                            }}
                        />
                    </p>
                )}
                {otherProps.children}
            </div>
        </TableQueryContext.Provider>
    );
}

export const TableQuery = withStyles(styles, { name: "CometAdminTableQuery" })(Query);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminTableQuery: TableQueryClassKey;
    }
}
