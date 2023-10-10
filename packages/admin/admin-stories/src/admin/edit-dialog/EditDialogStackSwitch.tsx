import { Field, FinalForm, FinalFormInput, Stack, StackPage, StackSwitch, useEditDialog, useStackSwitchApi } from "@comet/admin";
import { Button, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

const RootPage = (): React.ReactElement => {
    const stackApi = useStackSwitchApi();

    const [EditDialog, , editDialogApi] = useEditDialog();

    return (
        <>
            <Typography>Root Page</Typography>
            <Button variant="contained" onClick={() => editDialogApi.openAddDialog()}>
                Open Dialog
            </Button>
            <EditDialog>
                <FinalForm mode="add" onSubmit={(id: string) => stackApi.activatePage("edit", id)}>
                    {({ handleSubmit, submitting }) => {
                        return <Field name="name" label="Company group name" component={FinalFormInput} variant="horizontal" fullWidth required />;
                    }}
                </FinalForm>
            </EditDialog>
        </>
    );
};

const EditPage = (): React.ReactElement => {
    return <Typography>Edit Page</Typography>;
};

const StackPages = () => {
    return (
        <StackSwitch initialPage="root">
            <StackPage name="root">
                <RootPage />
            </StackPage>
            <StackPage name="edit" title="edit name">
                <EditPage />
            </StackPage>
        </StackSwitch>
    );
};

function Story() {
    return (
        <Stack topLevelTitle="root">
            <StackPages />
        </Stack>
    );
}

storiesOf("@comet/admin/edit-dialog-bug", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloRestStoryDecorator())
    .add("Edit Dialog with Form in Stack - Bug", () => <Story />);
