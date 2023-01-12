import { ApolloClient, gql, useApolloClient, useQuery } from "@apollo/client";
import { BallTriangle as BallTriangleIcon, Reload as ReloadIcon } from "@comet/admin-icons";
import { Button, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLDamFileDependentsQuery, GQLDamFileDependentsQueryVariables } from "../../graphql.generated";
import { DamDependencyRenderInfo } from "../config/DamConfigContext";
import { useDamConfig } from "../config/useDamConfig";

interface DependencyProps {
    id: string;
    getRenderInfo: (id: string, apolloClient: ApolloClient<unknown>) => Promise<DamDependencyRenderInfo> | DamDependencyRenderInfo;
    renderCustomContent?: (renderInfo: DamDependencyRenderInfo) => React.ReactNode;
}

const Dependency = ({ id, getRenderInfo, renderCustomContent }: DependencyProps) => {
    const apolloClient = useApolloClient();
    const [data, setData] = React.useState<DamDependencyRenderInfo>();

    React.useEffect(() => {
        const loadData = async () => {
            const renderInfo = await getRenderInfo(id, apolloClient);
            setData(renderInfo);
        };

        loadData();
    }, [apolloClient, getRenderInfo, id]);

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
                    <ListItemSecondaryAction>
                        {/*<IconButton component={Link} underline="none" href={href} size="large">*/}
                        {/*    <LinkIcon />*/}
                        {/*</IconButton>*/}
                        {/*<IconButton component={Link} underline="none" href={href} target="_blank" size="large">*/}
                        {/*    <OpenNewTabIcon />*/}
                        {/*</IconButton>*/}
                    </ListItemSecondaryAction>
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
                graphqlObjectType
                id
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
                if (!damConfig.dependencyRenderInfoProvider?.[dependent.graphqlObjectType]) {
                    return (
                        <FormattedMessage
                            id="comet.dam.dependencies.CannotResolveError"
                            defaultMessage="Missing render function for type {graphqlObjectType}"
                            values={{
                                graphqlObjectType: dependent.graphqlObjectType,
                            }}
                        />
                    );
                }

                return (
                    <ListItem key={dependent.id} divider>
                        <Dependency id={dependent.id} {...damConfig.dependencyRenderInfoProvider[dependent.graphqlObjectType]} />
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
