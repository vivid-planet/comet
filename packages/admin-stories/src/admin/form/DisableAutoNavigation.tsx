import { Stack, StackApiContext, StackPage, StackSwitch, StackSwitchApiContext } from "@comet/admin";
import { Table } from "@comet/admin";
import { Field, FinalForm, FinalFormInput, FormPaper } from "@comet/admin";
import { IconButton, Typography } from "@material-ui/core";
import { ArrowBack, Edit } from "@material-ui/icons";
import { boolean } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Switch } from "react-router";
import StoryRouter from "storybook-react-router";
import styled from "styled-components";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
export const Toolbar = styled.div`
    height: 60px;
    display: flex;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
`;

export const ToolbarItem = styled.div`
    :not(:last-child) {
        border-right: 1px solid lightgray;
    }
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 60px;
    padding: 0 20px;
`;

const SampleTable: React.FunctionComponent = () => {
    const stackApi = React.useContext(StackSwitchApiContext);

    return (
        <>
            <Toolbar>
                <ToolbarItem>
                    <Typography>Sample Table</Typography>
                </ToolbarItem>
            </Toolbar>
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
                            <>
                                <IconButton onClick={() => stackApi.activatePage("edit", recipe.id)}>
                                    <Edit color={"primary"} />
                                </IconButton>
                            </>
                        ),
                    },
                ]}
            />
        </>
    );
};

const SampleForm: React.FunctionComponent = () => {
    const stackApi = React.useContext(StackApiContext);

    const onSubmit = async () => {
        alert("Submit successful");
        return Promise.resolve();
    };
    const enableAutoNavigation = boolean("Enable Auto Navigation", false);
    return (
        <>
            <Toolbar>
                <ToolbarItem>
                    <IconButton
                        onClick={() => {
                            stackApi?.goBack();
                        }}
                    >
                        <ArrowBack color={"primary"} />
                    </IconButton>
                </ToolbarItem>
                <ToolbarItem>
                    <Typography>Sample Form</Typography>
                </ToolbarItem>
            </Toolbar>
            <Typography variant={"h3"}>Auto Navigation: {enableAutoNavigation ? "enabled" : "disabled"}</Typography>
            <FinalForm mode={"edit"} onSubmit={onSubmit} autoNavigationEnabled={enableAutoNavigation}>
                <FormPaper>
                    <Field label="Foo" name="foo" component={FinalFormInput} />
                </FormPaper>
            </FinalForm>
        </>
    );
};

function Story() {
    return (
        <>
            <Switch>
                <Stack topLevelTitle={"Sample"} showBreadcrumbs={false}>
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
