import { Add as AddIcon, Edit as EditIcon } from "@comet/admin-icons";
import { DialogContent, IconButton, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import { Button } from "../../common/buttons/Button";
import { FillSpace } from "../../common/FillSpace";
import { MainContent } from "../../common/MainContent";
import { ToolbarActions } from "../../common/toolbar/actions/ToolbarActions";
import { ToolbarItem } from "../../common/toolbar/item/ToolbarItem";
import { Toolbar } from "../../common/toolbar/Toolbar";
import { useEditDialog } from "../../EditDialog";
import { FinalForm } from "../../FinalForm";
import { Field } from "../../form/Field";
import { FinalFormInput } from "../../form/FinalFormInput";
import { Selected } from "../../Selected";
import { Table } from "../Table";

export default {
    title: "admin/table",
};

export const EditDialogHooks = {
    render: () => {
        interface IEditFormProps {
            row?: IExampleRow;
            mode: "edit" | "add";
        }
        // Defined in story to be able to call setData, hence using useMemo to avoid multiple rendering
        const EditForm = useMemo(() => {
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
        const [data, setData] = useState<IExampleRow[]>([
            { id: 1, foo: "blub", bar: "blub" },
            { id: 2, foo: "blub", bar: "blub" },
        ]);

        const [EditDialogComponent, selection, api] = useEditDialog();

        return (
            <>
                <Toolbar>
                    <ToolbarItem>
                        <Typography variant="h3">Edit Dialog Hooks</Typography>
                    </ToolbarItem>
                    <FillSpace />
                    <ToolbarActions>
                        <Button
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
                    <EditDialogComponent>
                        <DialogContent>
                            {selection.mode && (
                                <Selected selectionMode={selection.mode} selectedId={selection.id} rows={data}>
                                    {(row, { selectionMode: sm }) => {
                                        return <EditForm mode={sm} row={row} />;
                                    }}
                                </Selected>
                            )}
                        </DialogContent>
                    </EditDialogComponent>
                </MainContent>
            </>
        );
    },

    name: "EditDialog Hooks",
};
