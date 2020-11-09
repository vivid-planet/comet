import { Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import { Add as AddIcon, Edit as EditIcon } from "@material-ui/icons";
import { storiesOf } from "@storybook/react";
import { FinalForm, IEditDialogApi, Selected, Table, useEditDialog } from "@vivid-planet/react-admin-core";
import { TextField } from "@vivid-planet/react-admin-final-form-material-ui";
import { Field } from "@vivid-planet/react-admin-form";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import { apolloStoryDecorator } from "../apollo-story.decorator";

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
            onSubmit={values => {
                alert(JSON.stringify(values));
            }}
        >
            <Field name="foo" component={TextField} type="text" label="Name" />
        </FinalForm>
    );
}

function Story() {
    const data: IExampleRow[] = [
        { id: 1, foo: "blub", bar: "blub" },
        { id: 2, foo: "blub", bar: "blub" },
    ];

    const [EditDialog, selection, api] = useEditDialog();

    return (
        <>
            <Toolbar>
                <Button
                    color="default"
                    endIcon={<AddIcon />}
                    onClick={ev => {
                        api.openAddDialog();
                    }}
                >
                    <Typography variant="button">Hinzufügen</Typography>
                </Button>
            </Toolbar>
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
                        render: row => (
                            <IconButton
                                onClick={ev => {
                                    api.openEditDialog(String(row.id));
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        ),
                    },
                ]}
            />

            <EditDialog>
                {selection.mode && (
                    <Selected selectionMode={selection.mode} selectedId={selection.id} rows={data}>
                        {(row, { selectionMode: sm }) => <EditForm mode={sm} row={row} />}
                    </Selected>
                )}
            </EditDialog>
        </>
    );
}

storiesOf("react-admin-core", module)
    .addDecorator(StoryRouter())
    .addDecorator(apolloStoryDecorator())
    .add("Table EditDialog Hooks", () => <Story />);
