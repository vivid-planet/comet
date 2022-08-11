import { Field, FinalForm, FinalFormInput, FormSection, SaveButton, Stack, StackBreadcrumbs, StackPage, useStackSwitch } from "@comet/admin";
import { List, ListItem, ListItemText } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../story-router.decorator";

interface User {
    id: number;
    name: string;
}

const usersData: User[] = [
    {
        id: 1,
        name: "John Doe",
    },
    {
        id: 2,
        name: "Jane Gold",
    },
    {
        id: 3,
        name: "Steve Goodman",
    },
];

storiesOf("stories/form/Context-based Features", module)
    .addDecorator(apolloStoryDecorator())
    .addDecorator(storyRouterDecorator())
    .add("FinalForm in Stack", () => {
        const [StackSwitch, switchApi] = useStackSwitch();
        const [users, setUsers] = React.useState(usersData);

        return (
            <Stack topLevelTitle="Example Stack">
                <StackBreadcrumbs />
                <StackSwitch>
                    <StackPage name="list">
                        <List>
                            {users.map((user) => {
                                return (
                                    <ListItem
                                        style={{ background: "white", marginBottom: "10px" }}
                                        key={user.id}
                                        button
                                        onClick={() => switchApi.activatePage("form", String(user.id))}
                                    >
                                        <ListItemText primary={user.name} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </StackPage>
                    <StackPage name="form">
                        {(selectedUserId) => (
                            <FinalForm
                                mode="edit"
                                onSubmit={(values) => {
                                    return new Promise((resolve) =>
                                        setTimeout(() => {
                                            setUsers((users) => {
                                                return users.map((user) => {
                                                    if (user.id === Number(selectedUserId)) {
                                                        user.name = values.name;
                                                    }
                                                    return user;
                                                });
                                            });

                                            resolve(undefined);
                                        }, 500),
                                    );
                                }}
                                initialValues={users.find((user) => user.id === Number(selectedUserId))}
                            >
                                <FormSection>
                                    <Field label="Name" name="name" component={FinalFormInput} fullWidth />
                                </FormSection>
                                <SaveButton type="submit" />
                            </FinalForm>
                        )}
                    </StackPage>
                </StackSwitch>
            </Stack>
        );
    });
