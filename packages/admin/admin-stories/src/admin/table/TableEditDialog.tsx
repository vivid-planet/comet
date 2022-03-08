import {
    EditDialog,
    Field,
    FinalForm,
    FinalFormInput,
    IEditDialogApi,
    MainContent,
    Selected,
    Table,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
} from "@comet/admin";
import { Add as AddIcon, Edit as EditIcon } from "@comet/admin-icons";
import { Button, IconButton, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../apollo-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

function Story() {
    interface IEditFormProps {
        row: IExampleRow;
        mode: "edit" | "add";
    }
    // Defined in story to be able to call setData, hence using useMemo to avoid multiple rendering
    const EditForm = React.useMemo(() => {
        return (props: IEditFormProps) => (
            <FinalForm
                mode={props.mode}
                initialValues={props.row}
                onSubmit={async (values: IExampleRow) => {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    setData((data) => {
                        const index = data.findIndex((d) => d.id === values.id);
                        data[index] = values;
                        return [...data];
                    });
                }}
            >
                <Field name="foo" component={FinalFormInput} type="text" label="Name" fullWidth />
            </FinalForm>
        );
    }, []);

    interface IExampleRow {
        id: number;
        foo: string;
        bar: string;
    }
    const [data, setData] = React.useState<IExampleRow[]>([
        { id: 1, foo: "blub", bar: "blub" },
        { id: 2, foo: "blub", bar: "blub" },
    ]);
    const editDialog = React.useRef<IEditDialogApi>(null);
    return (
        <>
            <Toolbar>
                <ToolbarItem>
                    <Typography variant={"h3"}>Edit Dialog</Typography>
                </ToolbarItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Button
                        color="primary"
                        variant={"contained"}
                        startIcon={<AddIcon />}
                        onClick={(ev) => {
                            editDialog.current?.openAddDialog();
                        }}
                    >
                        Add
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
            </MainContent>
        </>
    );
}

storiesOf("@comet/admin/table", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloStoryDecorator())
    .add("EditDialog", () => <Story />);
