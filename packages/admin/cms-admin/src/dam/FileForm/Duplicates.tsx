import { gql, useQuery } from "@apollo/client";
import { FormSection, useStackApi } from "@comet/admin";
import { BallTriangle as BallTriangleIcon, Link as LinkIcon, OpenNewTab as OpenNewTabIcon, Reload as ReloadIcon } from "@comet/admin-icons";
import { Button, IconButton, Link, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLDamFileDuplicatesQuery, GQLDamFileDuplicatesQueryVariables } from "./Duplicates.generated";

export const damFileDuplicatesQuery = gql`
    query DamFileDuplicates($id: ID!) {
        damFile(id: $id) {
            duplicates {
                id
                name
                folder {
                    id
                    name
                    parents {
                        id
                        name
                    }
                }
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

const Duplicates: React.FC<{ fileId: string }> = ({ fileId }) => {
    const classes = useStyles();
    const stackApi = useStackApi();
    const { data, loading, refetch } = useQuery<GQLDamFileDuplicatesQuery, GQLDamFileDuplicatesQueryVariables>(damFileDuplicatesQuery, {
        variables: {
            id: fileId,
        },
        notifyOnNetworkStatusChange: true,
    });

    return (
        <FormSection
            title={
                <FormattedMessage
                    id="comet.dam.file.duplicates.title"
                    defaultMessage="{count, plural, =0 {No files found} one {# file} other {# files}}"
                    values={{ count: data?.damFile.duplicates.length || 0 }}
                />
            }
        >
            <List className={classes.list} disablePadding>
                <ListItem key="refresh" className={classes.listItemHeader} divider>
                    <Button size="small" endIcon={<ReloadIcon />} onClick={() => refetch({ id: fileId })} color="info">
                        <FormattedMessage id="comet.dam.file.duplicates.refresh" defaultMessage="Refresh" />
                    </Button>
                </ListItem>
                {data?.damFile.duplicates.map((file) => {
                    const folderPath = [],
                        urlPath = [];
                    if (file.folder) {
                        file.folder.parents.forEach((folder) => {
                            urlPath.push(folder.id, "folder");
                            folderPath.push(folder.name);
                        });
                        urlPath.push(file.folder.id, "folder");
                        folderPath.push(file.folder.name);
                    }
                    const href = `${stackApi?.breadCrumbs[0].url || ""}/${[...urlPath, file.id, "edit"].join("/")}`;

                    return (
                        <ListItem key={file.id} divider>
                            <ListItemTextWrapper>
                                <ListItemText primary={file.name} secondary={`/${folderPath.join("/")}`} />
                            </ListItemTextWrapper>
                            <ListItemSecondaryAction>
                                <IconButton component={Link} underline="none" href={href} size="large">
                                    <LinkIcon />
                                </IconButton>
                                <IconButton component={Link} underline="none" href={href} target="_blank" size="large">
                                    <OpenNewTabIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
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
        </FormSection>
    );
};

export default Duplicates;

const ListItemTextWrapper = styled("div")`
    padding-right: 48px;
`;
