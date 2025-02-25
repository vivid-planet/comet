import {
    Field,
    FinalForm,
    FinalFormInput,
    MainContent,
    Stack,
    StackPage,
    StackSwitch,
    StackSwitchApiContext,
    Table,
    Toolbar,
    ToolbarBackButton,
    ToolbarItem,
} from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { Box, Card, CardContent, IconButton, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { Switch } from "react-router";

import { storyRouterDecorator } from "../../story-router.decorator";

const SampleTable = () => {
    const stackApi = useContext(StackSwitchApiContext);

    return (
        <>
            <Box marginBottom={4}>
                <Toolbar>
                    <ToolbarBackButton />
                    <ToolbarItem>
                        <Typography variant="h3">Sample Table</Typography>
                    </ToolbarItem>
                </Toolbar>
            </Box>
            <Paper elevation={0}>
                <Table
                    data={[
                        { id: "1", name: "Lorem" },
                        { id: "2", name: "ipsum" },
                    ]}
                    totalCount={2}
                    columns={[
                        {
                            name: "id",
                            header: "id",
                        },
                        {
                            name: "name",
                            header: "Title",
                        },
                        {
                            name: "actions",
                            render: (recipe) => (
                                <IconButton color="primary" onClick={() => stackApi.activatePage("edit", recipe.id)} size="large">
                                    <Edit />
                                </IconButton>
                            ),
                        },
                    ]}
                />
            </Paper>
        </>
    );
};

const SampleForm = () => {
    const onSubmit = async () => {
        alert("Submit successful");
        return Promise.resolve();
    };

    return (
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarItem>
                    <Typography variant="h3">Sample Form</Typography>
                </ToolbarItem>
            </Toolbar>
            <MainContent>
                <FinalForm
                    mode="edit"
                    onSubmit={onSubmit}
                    onAfterSubmit={(values, form) => {
                        form.reset(values); //Reset values to new values so dirty state is correct after submitting
                    }}
                >
                    <Card variant="outlined">
                        <CardContent>
                            <Field label="Foo" name="foo" component={FinalFormInput} />
                        </CardContent>
                    </Card>
                </FinalForm>
            </MainContent>
        </>
    );
};

export default {
    title: "@comet/admin/form",
    decorators: [storyRouterDecorator()],
};

export const DisableAutoNavigation = () => {
    return (
        <Switch>
            <Stack topLevelTitle="Sample">
                <StackSwitch initialPage="table">
                    <StackPage name="table">
                        <SampleTable />
                    </StackPage>
                    <StackPage name="edit" title="Edit">
                        <SampleForm />
                    </StackPage>
                </StackSwitch>
            </Stack>
        </Switch>
    );
};
