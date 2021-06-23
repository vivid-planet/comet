import { MainContent, Stack, StackPage, StackSwitch, StackSwitchApiContext, Toolbar, ToolbarBackButton, ToolbarItem } from "@comet/admin";
import { Table } from "@comet/admin";
import { Field, FinalForm, FinalFormInput, FormPaper } from "@comet/admin";
import { Box, IconButton, Paper, Typography } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Switch } from "react-router";
import StoryRouter from "storybook-react-router";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

const SampleTable: React.FunctionComponent = () => {
    const stackApi = React.useContext(StackSwitchApiContext);

    return (
        <>
            <Box marginBottom={4}>
                <Toolbar>
                    <ToolbarBackButton />
                    <ToolbarItem>
                        <Typography variant={"h3"}>Sample Table</Typography>
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
                                <IconButton onClick={() => stackApi.activatePage("edit", recipe.id)}>
                                    <Edit color={"primary"} />
                                </IconButton>
                            ),
                        },
                    ]}
                />
            </Paper>
        </>
    );
};

const SampleForm: React.FunctionComponent = () => {
    const onSubmit = async () => {
        alert("Submit successful");
        return Promise.resolve();
    };

    return (
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarItem>
                    <Typography variant={"h3"}>Sample Form</Typography>
                </ToolbarItem>
            </Toolbar>
            <MainContent>
                <FinalForm
                    mode={"edit"}
                    onSubmit={onSubmit}
                    onAfterSubmit={(values, form) => {
                        form.reset(values); //Reset values to new values so dirty state is correct after submitting
                    }}
                >
                    <FormPaper>
                        <Field label="Foo" name="foo" component={FinalFormInput} />
                    </FormPaper>
                </FinalForm>
            </MainContent>
        </>
    );
};

function Story() {
    return (
        <>
            <Switch>
                <Stack topLevelTitle={"Sample"}>
                    <StackSwitch initialPage="table">
                        <StackPage name="table">
                            <SampleTable />
                        </StackPage>
                        <StackPage name="edit" title={"Edit"}>
                            <SampleForm />
                        </StackPage>
                    </StackSwitch>
                </Stack>
            </Switch>
        </>
    );
}

storiesOf("@comet/admin/form", module)
    .addDecorator(StoryRouter())
    .addDecorator(apolloStoryDecorator())
    .add("Disable Auto Navigation", () => <Story />);
