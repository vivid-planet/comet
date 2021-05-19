import {
    EditDialog,
    Field,
    FinalForm,
    FinalFormTextField,
    IEditDialogApi,
    MainContent,
    Selected,
    Stack,
    StackPage,
    StackSwitch,
    Table,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
} from "@comet/admin";
import { Button, IconButton, Typography } from "@material-ui/core";
import { Add as AddIcon, Edit as EditIcon } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

import { apolloStoryDecorator } from "../../apollo-story.decorator";

interface IExampleRow {
    id: number;
    foo: string;
    bar: string;
}

interface IEditFormProps {
    row: IExampleRow;
    mode: "edit" | "add";
}
function EditForm(props: IEditFormProps) {
    return (
        <FinalForm
            mode={props.mode}
            initialValues={props.row}
            onSubmit={(values) => {
                alert(JSON.stringify(values));
            }}
        >
            <Field name="foo" component={FinalFormTextField} type="text" label="Name" />
        </FinalForm>
    );
}

function Story() {
    const data: IExampleRow[] = [
        { id: 1, foo: "blub", bar: "blub" },
        { id: 2, foo: "blub", bar: "blub" },
    ];

    const editDialog = React.useRef<IEditDialogApi>(null);

    return (
        <>
            <Stack topLevelTitle="Stack">
                <StackSwitch>
                    <StackPage name="table">
                        <Toolbar>
                            <ToolbarItem>
                                <Typography variant={"h3"}>Table Stack Edit Dialog</Typography>
                            </ToolbarItem>
                            <ToolbarFillSpace />
                            <ToolbarActions>
                                <Button
                                    color="primary"
                                    variant={"contained"}
                                    endIcon={<AddIcon />}
                                    onClick={(ev) => {
                                        editDialog.current?.openAddDialog();
                                    }}
                                >
                                    <Typography variant="button">Hinzufügen</Typography>
                                </Button>
                            </ToolbarActions>
                        </Toolbar>

                        <MainContent>
                            <Table
                                data={data}
                                totalCount={data.length}
                                columns={[
                                    {
                                        name: "foo",
                                        header: "Foo",
                                    },
                                    {
                                        name: "bar",
                                        header: "Bar",
                                    },
                                    {
                                        name: "edit",
                                        header: "Edit",
                                        render: (row) => (
                                            <IconButton
                                                onClick={(ev) => {
                                                    editDialog.current?.openEditDialog(String(row.id));
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        ),
                                    },
                                ]}
                            />
                        </MainContent>
                    </StackPage>
                    <StackPage name="form" title="bearbeiten">
                        edit....
                    </StackPage>
                </StackSwitch>
            </Stack>

            <EditDialog ref={editDialog}>
                {({ selectedId, selectionMode }) => (
                    <>
                        {selectionMode && (
                            <Selected selectionMode={selectionMode} selectedId={selectedId} rows={data}>
                                {(row, { selectionMode: sm }) => <EditForm mode={sm} row={row} />}
                            </Selected>
                        )}
                    </>
                )}
            </EditDialog>
            <p>This story uses a Stack plus an EditDialog</p>
        </>
    );
}

storiesOf("@comet/admin/table", module)
    .addDecorator(StoryRouter())
    .addDecorator(apolloStoryDecorator())
    .add("Stack+EditDialog", () => <Story />);
