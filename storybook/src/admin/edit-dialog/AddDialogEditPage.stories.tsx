import {
    Button,
    FieldSet,
    SaveBoundary,
    StackBackButton,
    StackLink,
    StackMainContent,
    StackPage,
    StackSwitch,
    Tooltip,
    useEditDialog,
} from "@comet/admin";
import { Add, Edit } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { StoryObj } from "@storybook/react/*";

import { stackRouteDecorator } from "../../helpers/storyDecorators";
import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/edit-dialog",
    decorators: [stackRouteDecorator(), storyRouterDecorator()],
};

const Form = ({ id }: { id?: string }) => {
    return (
        <Typography variant="h4">
            Form:{" "}
            {id === undefined ? (
                "Adding a new item"
            ) : (
                <>
                    Editing existing item with id: <code>{id}</code>
                </>
            )}
        </Typography>
    );
};

const Page = () => {
    const [EditDialog, , editDialogApi] = useEditDialog();

    return (
        <>
            <StackSwitch>
                <StackPage name="grid">
                    <StackMainContent fullHeight>
                        <Tooltip title="Open the add dialog">
                            <Button sx={{ m: 2 }} startIcon={<Add />} onClick={() => editDialogApi.openAddDialog()}>
                                Add new item
                            </Button>
                        </Tooltip>
                        <Tooltip title="Open the edit page">
                            <Button sx={{ m: 2 }} startIcon={<Edit />} variant="secondary" component={StackLink} pageName="edit" payload="example-id">
                                Edit existing item
                            </Button>
                        </Tooltip>
                    </StackMainContent>
                </StackPage>
                <StackPage name="edit">
                    {(id) => (
                        <SaveBoundary>
                            <StackMainContent>
                                <FieldSet title="Edit form" endAdornment={<StackBackButton />}>
                                    <Form id={id} />
                                </FieldSet>
                            </StackMainContent>
                        </SaveBoundary>
                    )}
                </StackPage>
            </StackSwitch>
            <EditDialog title="Add new item">
                <Form />
            </EditDialog>
        </>
    );
};

export const AddDialogEditPage: StoryObj<typeof Page> = {
    render: Page,
};
