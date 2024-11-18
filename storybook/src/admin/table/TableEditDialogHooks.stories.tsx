import {
    Field,
    FinalForm,
    FinalFormInput,
    MainContent,
    Selected,
    Table,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useEditDialog,
} from "@comet/admin";
import { Add as AddIcon, Edit as EditIcon } from "@comet/admin-icons";
import { Button, IconButton, Typography } from "@mui/material";
import * as React from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/admin/table",
    decorators: [storyRouterDecorator()],
};

export const EditDialogHooks = {
    render: () => {
        interface IEditFormProps {
            row?: IExampleRow;
            mode: "edit" | "add";
        }
        // Defined in story to be able to call setData, hence using useMemo to avoid multiple rendering
        const EditForm = React.useMemo(() => {
            return (props: IEditFormProps) => (
                <FinalForm
                    mode={props.mode}
                    initialValues={props.row}
                    onSubmit={async (values: IExampleRow) => {
                        if (props.mode == "edit") {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            setData((data) => {
                                const index = data.findIndex((d) => d.id === values.id);
                                data[index] = values;
                                return [...data];
                            });
                        } else {
                            setData((data) => {
                                const lastId = data.length;
                                const newVal: IExampleRow = { id: lastId + 1, foo: values.foo, bar: values.foo };
                                return [...data, newVal];
                            });
                        }
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

        const [EditDialog, selection, api] = useEditDialog();

        return (
            <>
                <Toolbar>
                    <ToolbarItem>
                        <Typography variant="h3">Edit Dialog Hooks</Typography>
                    </ToolbarItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <Button
                            color="primary"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={(ev) => {
                                api.openAddDialog();
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
                                            api.openEditDialog(String(row.id));
                                        }}
                                        size="large"
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
                                {(row, { selectionMode: sm }) => {
                                    return <EditForm mode={sm} row={row} />;
                                }}
                            </Selected>
                        )}
                    </EditDialog>
                </MainContent>
            </>
        );
    },

    name: "EditDialog Hooks",
};
