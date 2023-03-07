import {
    Field,
    FinalForm,
    FinalFormInput,
    SaveButton,
    Stack,
    StackBackButton,
    StackLink,
    StackPage,
    StackSwitch,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useEditDialog,
    useStackApi,
    useStackSwitchApi,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { Button, Link, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { v4 } from "uuid";

import { apolloRestStoryDecorator } from "../../apollo-rest-story.decorator";
import { storyRouterDecorator } from "../../story-router.decorator";

interface ExampleRow {
    id: string;
    foo: string;
    bar: string;
}
type NewExampleInput = Omit<ExampleRow, "id">;

interface EditFormProps {
    row?: ExampleRow;
    mode: "edit" | "add";
    onSubmit: (newData: ExampleRow | NewExampleInput) => Promise<ExampleRow>;
}
function EditForm(props: EditFormProps) {
    const stackApi = useStackApi();
    const stackSwitchApi = useStackSwitchApi();

    const newId = React.useRef<string>();

    return (
        <FinalForm
            mode={props.mode}
            initialValues={props.row}
            onSubmit={async (values) => {
                const newRow = await props.onSubmit(values);
                if (props.mode === "add") {
                    newId.current = newRow.id;
                }
            }}
            onAfterSubmit={() => {
                if (props.mode === "edit") {
                    stackApi?.goBack();
                } else {
                    if (newId.current) {
                        stackSwitchApi.activatePage("edit", newId.current);
                    }
                }
            }}
        >
            {({ handleSubmit }) => {
                return (
                    <>
                        <Field name="foo" component={FinalFormInput} type="text" label="Foo" fullWidth />
                        <Field name="bar" component={FinalFormInput} type="text" label="Bar" fullWidth />
                        {props.mode === "edit" && <SaveButton type="submit" onClick={handleSubmit} />}
                    </>
                );
            }}
        </FinalForm>
    );
}

function Story() {
    const [data, setData] = React.useState<ExampleRow[]>([
        { id: v4(), foo: "blub", bar: "blub" },
        { id: v4(), foo: "blub", bar: "blub" },
    ]);

    const addRow = (input: NewExampleInput) => {
        const newRow = { id: v4(), ...input };
        setData((currentData) => {
            return [...currentData, newRow];
        });
        return Promise.resolve(newRow);
    };

    const updateRow = React.useCallback((updatedRow: ExampleRow) => {
        setData((currentData) => {
            const newData = currentData.map((row) => {
                if (row.id === updatedRow.id) {
                    return updatedRow;
                }
                return row;
            });
            return newData;
        });
        return Promise.resolve(updatedRow);
    }, []);

    const [EditDialog, selection, editDialogApi] = useEditDialog();

    return (
        <Stack topLevelTitle="Table in Stack With Stack Form and EditDialog Form">
            <StackSwitch>
                <StackPage name="table">
                    <Toolbar>
                        <ToolbarItem>
                            <Typography variant="h3">Table Stack Edit Dialog</Typography>
                        </ToolbarItem>
                        <ToolbarFillSpace />
                        <ToolbarActions>
                            <Button
                                color="primary"
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={(ev) => {
                                    editDialogApi.openAddDialog();
                                }}
                            >
                                Add
                            </Button>
                        </ToolbarActions>
                    </Toolbar>

                    <div style={{ height: "70vh" }}>
                        <DataGrid
                            columns={[
                                { field: "id", headerName: "ID" },
                                { field: "foo", headerName: "Foo" },
                                { field: "bar", headerName: "Bar" },
                                {
                                    field: "edit",
                                    headerName: "",
                                    renderCell: ({ row }) => {
                                        return (
                                            <Link component={StackLink} pageName="edit" payload={row.id}>
                                                <Edit />
                                            </Link>
                                        );
                                    },
                                },
                            ]}
                            rows={data}
                        />
                    </div>
                    <EditDialog
                        onAfterSave={() => {
                            //noop
                        }}
                    >
                        {selection.mode === "add" && <EditForm mode="add" onSubmit={addRow} />}
                    </EditDialog>
                </StackPage>
                <StackPage name="edit">
                    {(selectedId) => {
                        // in a real application, pass the id to the form and load the form data via Apollo
                        const row = data.find((row) => row.id === selectedId);
                        if (row === undefined) {
                            return null;
                        }
                        return (
                            <>
                                <StackBackButton />
                                <EditForm row={row} mode="edit" onSubmit={updateRow} />
                            </>
                        );
                    }}
                </StackPage>
            </StackSwitch>
        </Stack>
    );
}

storiesOf("@comet/admin/table", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloRestStoryDecorator())
    .add("Table in Stack With Stack Form and EditDialog Form", () => <Story />);
