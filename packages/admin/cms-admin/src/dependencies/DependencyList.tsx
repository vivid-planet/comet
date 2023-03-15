import { ApolloError } from "@apollo/client";
import { OperationVariables } from "@apollo/client/core";
import { ApolloQueryResult } from "@apollo/client/core/types";
import { BallTriangle as BallTriangleIcon, Reload as ReloadIcon } from "@comet/admin-icons";
import { Button, List, ListItem, ListItemIcon } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useContentScope } from "../contentScope/Provider";
import { GQLDependency } from "../graphql.generated";
import { useDependenciesConfig } from "./DependenciesConfig";
import { DependencyComponentInterface } from "./Dependency";

const useStyles = makeStyles((theme) => ({
    list: {
        backgroundColor: theme.palette.background.paper,
    },
    listItemHeader: {
        display: "flex",
        justifyContent: "flex-end",
    },
    listItemIcon: {
        display: "flex",
        justifyContent: "center",
    },
    listItemLoadingIcon: {
        fontSize: 32,
        margin: theme.spacing(2, 0),
    },
}));

interface DependencyListProps {
    loading: boolean;
    error: ApolloError | undefined;
    refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<unknown>>;
    dependencyItems: Array<Pick<GQLDependency, "rootColumnName" | "jsonPath"> & { id: string; graphqlObjectType: string }> | undefined;
}

export const DependencyList = ({ loading, error, refetch, dependencyItems }: DependencyListProps) => {
    const classes = useStyles();
    const dependenciesConfig = useDependenciesConfig();
    const contentScope = useContentScope();

    return (
        <List className={classes.list} disablePadding>
            <ListItem key="refresh" className={classes.listItemHeader} divider>
                <Button size="small" endIcon={<ReloadIcon />} onClick={() => refetch()} color="info">
                    <FormattedMessage id="comet.dam.dependencies.refresh" defaultMessage="Refresh" />
                </Button>
            </ListItem>
            {dependencyItems?.map((item) => {
                const DependencyComponent: DependencyComponentInterface | undefined = dependenciesConfig[item.graphqlObjectType]?.DependencyComponent;

                if (DependencyComponent === undefined) {
                    return (
                        <FormattedMessage
                            key={`${item.id}|${item.jsonPath}`}
                            id="comet.dam.dependencies.missingDependencyComponent"
                            defaultMessage="Error: Missing DependencyComponent for type {graphqlObjectType}. ID: {id}."
                            values={{
                                graphqlObjectType: item.graphqlObjectType,
                                id: item.id,
                            }}
                        />
                    );
                }

                return (
                    <DependencyComponent
                        key={`${item.id}|${item.jsonPath}`}
                        id={item.id}
                        dependencyData={item}
                        contentScopeUrl={contentScope.match.url}
                    />
                );
            })}
            {loading && (
                <ListItem key="loading" className={classes.listItemIcon} divider>
                    <ListItemIcon>
                        <BallTriangleIcon className={classes.listItemLoadingIcon} />
                    </ListItemIcon>
                </ListItem>
            )}
        </List>
    );
};
