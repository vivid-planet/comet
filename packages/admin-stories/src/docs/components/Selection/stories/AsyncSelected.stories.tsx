import { gql, useQuery } from "@apollo/client";
import { Selected, useSelection } from "@comet/admin";
import { Add } from "@comet/admin-icons";
import { Grid, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../../story-router.decorator";

const gqlRest = gql;

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

export const partialUsersQuery = gqlRest`
query users {
    users @rest(type: "User", path: "users") {
        id
        name
    }
}
`;

export interface PartialUsersQueryData {
    users: Pick<User, "id" | "name">[];
}

export const userDetailQuery = gqlRest`
query user(
        $id: Int
    ) {
        user(
            id: $id
        ) @rest(type: "User", path: "users/{args.id}") {
            id
            name
        }
    }
`;

export interface UserDetailQueryData {
    user: User;
}

storiesOf("stories/components/Selection/Async Selected", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(storyRouterDecorator())
    .add("Async Selected", () => {
        const [selection, selectionApi] = useSelection();
        const { data: partialUserData } = useQuery<PartialUsersQueryData, {}>(partialUsersQuery);

        if (!partialUserData) return <></>;

        return (
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <List>
                        {partialUserData.users.map((user) => {
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
                    <Selected<User> selectionMode={selection.mode} selectedId={selection.id} query={userDetailQuery} dataAccessor="user">
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
