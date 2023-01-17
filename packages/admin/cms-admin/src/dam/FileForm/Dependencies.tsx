import { gql, useApolloClient, useQuery } from "@apollo/client";
import { BallTriangle as BallTriangleIcon, Link as LinkIcon, OpenNewTab as OpenNewTabIcon, Reload as ReloadIcon } from "@comet/admin-icons";
import { Button, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { useContentScope } from "../../contentScope/Provider";
import { GQLDamFileDependentsQuery, GQLDamFileDependentsQueryVariables } from "../../graphql.generated";
import { DamDependencyRenderInfo, GetRenderInfo } from "../config/DamConfigContext";
import { useDamConfig } from "../config/useDamConfig";

interface DependencyProps {
    id: string;
    graphqlObjectType: string;
    getRenderInfo: GetRenderInfo;
    renderCustomContent?: (renderInfo: DamDependencyRenderInfo) => React.ReactNode;
}

const Dependency = ({ id, graphqlObjectType, getRenderInfo, renderCustomContent }: DependencyProps) => {
    const apolloClient = useApolloClient();
    const contentScope = useContentScope();

    const [data, setData] = React.useState<DamDependencyRenderInfo>();
    const [error, setError] = React.useState<boolean>(false);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const renderInfo = await getRenderInfo(id, { apolloClient, contentScope });
                setData(renderInfo);
            } catch {
                setError(true);
            }
        };

        loadData();
        // should only be executed when id changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (error) {
        return (
            <FormattedMessage
                id="comet.dam.dependency.cannotResolveDependencyError"
                defaultMessage="Error: Cannot resolve this dependency. Type: {graphqlObjectType}, ID: {id}."
                values={{
                    graphqlObjectType: graphqlObjectType,
                    id: id,
                }}
            />
        );
    }

    if (data === undefined) {
        // TODO: Loading state
        return <>Loading...</>;
    }

    return (
        <>
            {renderCustomContent !== undefined ? (
                renderCustomContent(data)
            ) : (
                <>
                    <ListItemText primary={data?.type} />
                    <ListItemText primary={data?.name} secondary={data?.secondaryInfo} />
                    {!!data.url && (
                        <ListItemSecondaryAction>
                            <IconButton component={Link} to={data.url}>
                                <LinkIcon />
                            </IconButton>
                            <IconButton component={Link} to={data.url} target="_blank">
                                <OpenNewTabIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    )}
                </>
            )}
        </>
    );
};

const damFileDependentsQuery = gql`
    query DamFileDependents($id: ID!) {
        damFile(id: $id) {
            id
            dependents {
                rootGraphqlObjectType
                rootId
                blockname
                jsonPath
            }
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    list: {
        backgroundColor: theme.palette.background.paper,
    },
    listItem: {
        minHeight: 61,
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

interface DependenciesProps {
    fileId: string;
}

export const Dependencies = ({ fileId }: DependenciesProps) => {
    const classes = useStyles();
    const damConfig = useDamConfig();

    const { data, loading, refetch } = useQuery<GQLDamFileDependentsQuery, GQLDamFileDependentsQueryVariables>(damFileDependentsQuery, {
        variables: {
            id: fileId,
        },
    });

    return (
        <List className={classes.list} disablePadding>
            <ListItem key="refresh" className={classes.listItemHeader} divider>
                <Button size="small" endIcon={<ReloadIcon />} onClick={() => refetch()} color="info">
                    <FormattedMessage id="comet.dam.dependencies.refresh" defaultMessage="Refresh" />
                </Button>
            </ListItem>
            {data?.damFile.dependents.map((dependent) => {
                // console.log("jsonPath ", dependent.jsonPath);

                if (!damConfig.dependencyRenderInfoProvider?.[dependent.rootGraphqlObjectType]) {
                    return (
                        <FormattedMessage
                            key={`${dependent.rootId}|${dependent.jsonPath}`}
                            id="comet.dam.dependencies.MissingRenderInfo"
                            defaultMessage="Error: Missing render info provider for type {graphqlObjectType}."
                            values={{
                                graphqlObjectType: dependent.rootGraphqlObjectType,
                            }}
                        />
                    );
                }

                return (
                    <ListItem key={`${dependent.rootId}|${dependent.jsonPath}`} className={classes.listItem} divider>
                        <Dependency
                            id={dependent.rootId}
                            graphqlObjectType={dependent.rootGraphqlObjectType}
                            {...damConfig.dependencyRenderInfoProvider[dependent.rootGraphqlObjectType]}
                        />
                    </ListItem>
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
