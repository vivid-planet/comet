import { useQuery } from "@apollo/client";
import { OperationVariables } from "@apollo/client/core";
import { Link as LinkIcon, OpenNewTab as OpenNewTabIcon } from "@comet/admin-icons";
import { CircularProgress, IconButton, ListItem, ListItemProps, ListItemSecondaryAction, ListItemText } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { DependencyInterface } from "../documents/types";
import { GQLDependency } from "../graphql.generated";

export interface DependencyComponentProps {
    id: string;
    dependencyData: Pick<GQLDependency, "rootColumnName" | "jsonPath">;
    contentScopeUrl: string;
}
export type DependencyComponentInterface = (props: DependencyComponentProps) => React.ReactElement<ListItemProps>;

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 61,
    },
    displayNameColumn: {
        flexGrow: 0,
        paddingRight: theme.spacing(4),
    },
}));

interface DependencyProps<GQLQuery = Record<string, unknown>, GQLQueryVariables = OperationVariables> {
    id: string;
    DependencyObject: DependencyInterface<GQLQuery, GQLQueryVariables>;
    graphqlVariables: GQLQueryVariables;
    dependencyData: Pick<GQLDependency, "rootColumnName" | "jsonPath">;
    contentScopeUrl: string;
}

export function Dependency<GQLQuery = Record<string, unknown>, GQLQueryVariables = OperationVariables>({
    id,
    DependencyObject,
    graphqlVariables,
    dependencyData,
    contentScopeUrl,
}: DependencyProps<GQLQuery, GQLQueryVariables>) {
    const classes = useStyles();
    const { data, error, loading } = useQuery(DependencyObject.dependencyQuery, {
        variables: graphqlVariables,
    });

    if (error) {
        return <CantResolveDependencyErrorMessage displayName={DependencyObject.displayName} id={id} />;
    }

    if (data === undefined || loading) {
        return <CircularProgress />;
    }

    let name: React.ReactNode, secondaryInformation: React.ReactNode, url: string | undefined;

    try {
        name = DependencyObject.getName(data);
        secondaryInformation = DependencyObject.getSecondaryInformation?.(data);
        url = DependencyObject.getUrl(data, { rootColumn: dependencyData.rootColumnName, jsonPath: dependencyData.jsonPath, contentScopeUrl });
    } catch {
        return <CantResolveDependencyErrorMessage displayName={DependencyObject.displayName} id={id} />;
    }

    return (
        <ListItem className={classes.root} divider>
            <ListItemText className={classes.displayNameColumn} primary={DependencyObject.displayName} />
            <ListItemText primary={name} secondary={secondaryInformation} />
            {!!url && (
                <ListItemSecondaryAction>
                    <IconButton component={Link} to={url}>
                        <LinkIcon />
                    </IconButton>
                    <IconButton component={Link} to={url} target="_blank">
                        <OpenNewTabIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    );
}

interface CantResolveDependencyErrorMessageProps {
    displayName: React.ReactNode;
    id: string;
}

const CantResolveDependencyErrorMessage = ({ displayName, id }: CantResolveDependencyErrorMessageProps) => {
    const classes = useStyles();

    return (
        <ListItem className={classes.root} divider>
            <FormattedMessage
                id="comet.dam.dependency.cannotResolveDependencyError"
                defaultMessage="Error: Cannot resolve this dependency. Type: {dependencyName}, ID: {id}."
                values={{
                    dependencyName: displayName,
                    id: id,
                }}
            />
        </ListItem>
    );
};
