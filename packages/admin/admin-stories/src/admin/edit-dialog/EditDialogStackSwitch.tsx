import { Field, FinalForm, FinalFormInput, Stack, StackPage, StackSwitch, useEditDialog, useStackSwitchApi } from "@comet/admin";
import { Button, Typography } from "@mui/material";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

type FormValues = {
    name: string;
};

const RootPage = (): React.ReactElement => {
    const idRef = React.useRef<string>();
    const stackApi = useStackSwitchApi();

    const [EditDialog, , editDialogApi, selectionApi] = useEditDialog();

    return (
        <>
            <Typography>Root Page</Typography>
            <Button variant="contained" onClick={() => editDialogApi.openAddDialog()}>
                Open Dialog
            </Button>
            <EditDialog disableCloseAfterSave>
                <FinalForm
                    mode="add"
                    onSubmit={(values: FormValues) => {
                        idRef.current = values.name;

                        // Simulate submitting
                        return new Promise<void>((resolve) => {
                            setTimeout(() => {
                                resolve();
                            }, 500);
                        });
                    }}
                    onAfterSubmit={() => {
                        selectionApi.handleDeselect();

                        if (idRef.current) {
                            stackApi.activatePage("edit", idRef.current);
                        }
                    }}
                >
                    <Field name="name" label="Company group name" component={FinalFormInput} variant="horizontal" fullWidth required />
                </FinalForm>
            </EditDialog>
        </>
    );
};

type EditPageProps = {
    id: string;
};

const EditPage = ({ id }: EditPageProps): React.ReactElement => {
    return <Typography>Edit Page: {id}</Typography>;
};

const StackPages = () => {
    return (
        <StackSwitch initialPage="root">
            <StackPage name="root">
                <RootPage />
            </StackPage>
            <StackPage name="edit" title="edit name">
                {(id) => <EditPage id={id} />}
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

storiesOf("@comet/admin/edit-dialog", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloRestStoryDecorator())
    .add("Edit Dialog with Stack Navigation", () => <Story />);
