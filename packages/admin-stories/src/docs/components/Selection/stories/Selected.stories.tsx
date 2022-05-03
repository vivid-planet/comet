import { gql, useQuery } from "@apollo/client";
import { Selected, useSelection } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Grid, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../../story-router.decorator";

const gqlRest = gql;

export const usersQuery = gqlRest`
query users {
    users @rest(type: "User", path: "users") {
        id
        name
        username
        email
    }
}
`;

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

export interface UsersQueryData {
    users: User[];
}

storiesOf("stories/components/Selection/Selected", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Selected", () => {
        const [selection, selectionApi] = useSelection();
        const { data } = useQuery<UsersQueryData, {}>(usersQuery);

        if (!data) return <></>;

        return (
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <List>
                        {data.users.map((user) => {
                            return (
                                <ListItem key={user.id} button onClick={() => selectionApi.handleSelectId(String(user.id))}>
                                    <ListItemText primary={`Item ${user.name}`} />
                                </ListItem>
                            );
                        })}
                        <ListItem button onClick={() => selectionApi.handleAdd()}>
                            <ListItemIcon>
                                <Add />
                            </ListItemIcon>
                            <ListItemText primary="Add Item" />
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={2}>
                    <h3>Selected Item:</h3>
                    <Selected selectionMode={selection.mode} selectedId={selection.id} rows={data.users}>
                        {(user, { selectionMode }) => {
                            return (
                                <div>
                                    <p>Id: {user?.id}</p>
                                    <p>Username: {user?.username}</p>
                                    <p>Name: {user?.name}</p>
                                    <p>E-Mail: {user?.email}</p>
                                    <p>Mode: {selectionMode}</p>
                                </div>
                            );
                        }}
                    </Selected>
                </Grid>
            </Grid>
        );
    });
